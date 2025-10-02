#!/usr/bin/env node
import { S3Client, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import OpenAI from 'openai';
import fs from 'node:fs/promises';
import path from 'node:path';

const apiKey = process.env.OPENAI_API_KEY;
const bucket = process.env.ASSET_BUCKET;
const prefix = process.env.ASSET_PREFIX ?? 'phase-1';
const region = process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION;

if (!apiKey) {
  console.error('OPENAI_API_KEY missing. Create a repo secret and export it before running this script.');
  process.exit(1);
}

if (!bucket) {
  console.error('ASSET_BUCKET missing. Provide the S3 bucket that should store the generated assets.');
  process.exit(1);
}

if (!region) {
  console.error('AWS_REGION missing. Configure the target region before generating assets.');
  process.exit(1);
}

const openai = new OpenAI({ apiKey });
const s3 = new S3Client({ region });

const assetPlan = [
  {
    key: 'characters/chacha.png',
    prompt:
      'Create a high-resolution illustration of Chacha Choudhary in vibrant Raj Comics style, wearing his red turban and yellow waistcoat, smiling and waving toward the viewer, comic panel friendly, dynamic inks, bold colours.'
  },
  {
    key: 'characters/sabu.png',
    prompt:
      'Illustrate Sabu from Jupiter holding a plate of parathas, towering friendly giant, Raj Comics style, bold outlines, heroic posture, cheerful expression.'
  },
  {
    key: 'characters/bini.png',
    prompt:
      'Create Bini Chachi in Raj Comics style, slightly panicked expression, traditional saree, holding an empty fruit basket in Chacha Choudhary universe.'
  },
  {
    key: 'characters/cheenu.png',
    prompt:
      'Raj Comics style milkman Cheenu with milk canisters, early morning lighting, friendly smile.'
  },
  {
    key: 'characters/raju.png',
    prompt:
      'Raj Comics kid Raju with messy hair, holding a leash, playful tone, vibrant colours.'
  },
  {
    key: 'characters/pandu.png',
    prompt:
      'Raj Comics fruit seller Pandu with mango cart, honest expression, evening warm lighting.'
  },
  {
    key: 'characters/gudiya.png',
    prompt:
      'Adorable Indian mongrel dog named Gudiya, mango peel around mouth, playful, Raj Comics illustration style.'
  },
  {
    key: 'scenes/welcome.jpg',
    prompt:
      'Dynamic comic splash background featuring Chacha Choudhary and Sabu greeting players, bright sky, celebratory confetti, Raj Comics aesthetic.'
  },
  {
    key: 'scenes/garden.jpg',
    prompt:
      'Chacha Choudhary garden with mango tree missing fruits, footprints on ground, moonlit dawn ambience, Raj Comics style.'
  },
  {
    key: 'scenes/deduction.jpg',
    prompt:
      'Comic style deduction board with clues pinned, dramatic lighting, Raj Comics vibe, energetic composition.'
  },
  {
    key: 'scenes/celebration.jpg',
    prompt:
      'Festive celebration with Chacha, Sabu, and playful dog dancing amid mango peels, Raj Comics triumphant panel.'
  },
  {
    key: 'ui/footprint.png',
    prompt:
      'Icon of small dog footprints in mango pulp, vector style, high contrast, Raj Comics UI emblem.'
  },
  {
    key: 'ui/mango-bowl.png',
    prompt:
      'Iconic bowl overflowing with mango peels, stylised comic shading, bold outlines.'
  },
  {
    key: 'ui/ladder.png',
    prompt:
      'Tall sturdy ladder illustration with comic shading, suitable for UI icon.'
  },
  {
    key: 'ui/badge-brain.png',
    prompt:
      'Badge illustration reading "Brain Power" with lightning and mango motifs, Raj Comics emblem.'
  },
  {
    key: 'ui/badge-choice.png',
    prompt:
      'Badge illustration reading "Chacha’s Choice" featuring mango and magnifying glass, Raj Comics emblem.'
  }
];

const tempDir = path.join(process.cwd(), '.asset-cache');
await fs.mkdir(tempDir, { recursive: true });

const generateAsset = async ({ key, prompt }) => {
  const objectKey = `${prefix}/${key}`;
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: objectKey }));
    console.log(`✅ ${objectKey} already exists – skipping generation.`);
    return;
  } catch (error) {
    console.log(`ℹ️  ${objectKey} missing. Generating via DALL·E 4...`);
  }

  const result = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    size: '1024x1024',
    quality: 'hd'
  });

  const imageBase64 = result.data[0]?.b64_json;
  if (!imageBase64) {
    throw new Error(`No image payload returned for ${key}`);
  }

  const buffer = Buffer.from(imageBase64, 'base64');
  const filePath = path.join(tempDir, key.replace(/\//g, '_'));
  await fs.writeFile(filePath, buffer);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: buffer,
      ContentType: key.endsWith('.png') ? 'image/png' : 'image/jpeg',
      ACL: 'public-read'
    })
  );

  console.log(`🚀 Uploaded ${objectKey}`);
};

for (const asset of assetPlan) {
  await generateAsset(asset);
}

console.log('All assets verified. Update VITE_ASSET_BASE_URL to https://{bucket}.s3.${region}.amazonaws.com/${prefix}');
