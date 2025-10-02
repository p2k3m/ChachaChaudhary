import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { createHash } from 'crypto';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import OpenAI from 'openai';
import { z } from 'zod';

const requestSchema = z.object({
  context: z.record(z.unknown()),
  locale: z.string().optional(),
  episode: z.string()
});

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    'OPENAI_API_KEY is not configured. Add it as an encrypted secret in GitHub and pass it to the Lambda environment.'
  );
}

const model = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini';
const cacheBucket = process.env.HINT_CACHE_BUCKET;
const cachePrefix = process.env.HINT_CACHE_PREFIX ?? 'hints';
const allowOrigin = process.env.ALLOWED_ORIGIN ?? '*';

const openai = new OpenAI({ apiKey });
const s3 = cacheBucket ? new S3Client({}) : undefined;

const buildPrompt = (context: unknown, locale?: string, episode?: string) => `
You are Chacha Choudhary guiding a young detective in a vibrant Raj Comics style adventure.
Episode: ${episode ?? 'missing-mangoes-phase-1'}
Locale: ${locale ?? 'en-IN'}
Context JSON: ${JSON.stringify(context, null, 2)}

Craft a single concise hint (max 45 words) in Hinglish that nudges the player toward the culprit without revealing the answer.
Keep the tone witty, warm, and encouraging. Mention relevant clues subtly.
`;

const ok = (body: Record<string, unknown>): APIGatewayProxyResultV2 => ({
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type'
  },
  body: JSON.stringify(body)
});

const fail = (statusCode: number, message: string): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type'
  },
  body: JSON.stringify({ message })
});

const readCache = async (cacheKey: string) => {
  if (!cacheBucket || !s3) {
    return undefined;
  }
  try {
    const object = await s3.send(
      new GetObjectCommand({
        Bucket: cacheBucket,
        Key: `${cachePrefix}/${cacheKey}.json`
      })
    );
    const text = await object.Body?.transformToString('utf-8');
    return text ? (JSON.parse(text) as { hint: string; source: string }) : undefined;
  } catch (error) {
    console.warn('Cache miss or error', error);
    return undefined;
  }
};

const writeCache = async (cacheKey: string, payload: { hint: string; source: string }) => {
  if (!cacheBucket || !s3) {
    return;
  }
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: cacheBucket,
        Key: `${cachePrefix}/${cacheKey}.json`,
        Body: JSON.stringify(payload),
        ContentType: 'application/json'
      })
    );
  } catch (error) {
    console.error('Failed to write cache', error);
  }
};

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  if (event.requestContext.http?.method !== 'POST') {
    return fail(405, 'Only POST requests are supported.');
  }

  if (!event.body) {
    return fail(400, 'Missing request body. Send JSON with context details.');
  }

  let parsedBody: z.infer<typeof requestSchema>;

  try {
    const json = JSON.parse(event.body);
    parsedBody = requestSchema.parse(json);
  } catch (error) {
    return fail(400, `Invalid payload: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const cacheKey = createHash('sha1').update(JSON.stringify(parsedBody)).digest('hex');

  const cached = await readCache(cacheKey);
  if (cached) {
    return ok({ ...cached, cached: true });
  }

  try {
    const prompt = buildPrompt(parsedBody.context, parsedBody.locale, parsedBody.episode);

    const completion = await openai.responses.create({
      model,
      input: prompt,
      max_output_tokens: 120
    });

    const text = completion.output_text.trim();
    const payload = { hint: text, source: 'llm' };
    await writeCache(cacheKey, payload);

    return ok(payload);
  } catch (error) {
    console.error('Hint generation failed', error);
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to generate hint. Verify OpenAI credentials and network access.';
    return fail(500, message);
  }
};
