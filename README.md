# Chacha Choudhary – Missing Mangoes (Phase 1)

An interactive Raj Comics inspired deduction game starring Chacha Choudhary, Sabu, and friends. Phase 1 delivers a complete single-episode loop with comic panels, clue investigation, drag-to-match deduction, scoring, and serverless hint generation.

## Architecture Overview

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 19 canary + Vite + TypeScript, Framer Motion, Zustand, CSS Grid | Rich comic UI, stateful journey, responsive design |
| Hint API | AWS Lambda (Node 20, OpenAI Responses API) + HTTP API Gateway | Generates witty Hinglish hints, caches in S3 to avoid repeated LLM costs |
| Asset Pipeline | OpenAI Images (DALL·E) via scripted generation | One-time Raj Comics style assets uploaded to S3 |
| Hosting | S3 + CloudFront | Serves bundled React app globally |
| Deployment | GitHub Actions + AWS CloudFormation | CI/CD with secret validation and fail-fast guards |

## Local Development

1. **Install dependencies**

   ```bash
   cd app
   npm install
   ```

2. **Configure environment variables**

   Create `app/.env` (never commit) with:

   ```ini
   VITE_ASSET_BASE_URL=https://your-asset-bucket.s3.<region>.amazonaws.com/phase-1
   VITE_HINT_API_BASE=https://<api-id>.execute-api.<region>.amazonaws.com/prod
   ```

3. **Run locally**

   ```bash
   npm run dev
   ```

4. **Testing & linting**

   ```bash
   npm run lint
   npm run test
   ```

## Hint Lambda (Serverless)

```bash
cd lambda/hint-service
npm install
npm run build
```

Environment variables required at runtime:

- `OPENAI_API_KEY` – stored in AWS Secrets Manager, referenced via ARN in CloudFormation.
- `HINT_CACHE_BUCKET` – injected via stack parameters for S3 caching.
- `ALLOWED_ORIGIN` – restricts CORS for the API Gateway stage.

## Asset Generation Workflow (One-Time)

1. Upload credentials as env vars: `OPENAI_API_KEY`, `AWS_REGION`, `ASSET_BUCKET`, optional `ASSET_PREFIX`.
2. Run the helper script (uses DALL·E only when objects are missing):

   ```bash
   cd lambda/hint-service
   npm install
   npm run generate:assets
   ```

3. After upload, set `VITE_ASSET_BASE_URL` to `https://$ASSET_BUCKET.s3.$AWS_REGION.amazonaws.com/$ASSET_PREFIX`.

The script checks S3 via `HeadObject` before generating, ensuring AI costs are incurred only for missing assets.

## AWS Deployment

1. **Prepare GitHub secrets (Settings → Secrets and variables → Actions):**

   | Key | Description |
   | --- | --- |
   | `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Deployment IAM user with CloudFormation, S3, Lambda, CloudFront, API Gateway permissions |
   | `AWS_REGION` | Target AWS region (e.g. `ap-south-1`) |
   | `WEBSITE_BUCKET_NAME` | Pre-created S3 bucket for bundled React app |
   | `ASSET_BUCKET_NAME` | S3 bucket containing generated art assets |
   | `HINT_CACHE_BUCKET_NAME` | S3 bucket for persisted hints |
   | `LAMBDA_ARTIFACT_BUCKET` | S3 bucket where CI uploads the Lambda zip |
   | `OPENAI_SECRET_ARN` | Secrets Manager ARN with key `apiKey` |
   | `CLOUDFORMATION_STACK_NAME` | Stack name (e.g. `missing-mangoes-phase1`) |
   | `ALLOWED_ORIGIN` | Frontend origin for hint API CORS |

2. **GitHub Action**

   The workflow `.github/workflows/deploy.yml` will:

   - Fail immediately if any secret is missing.
   - Build, lint, and test the React app.
   - Bundle the Lambda and push the artifact to `LAMBDA_ARTIFACT_BUCKET`.
   - Deploy/update the CloudFormation stack using `infrastructure/template.yaml`.
   - Sync the `app/dist` directory to `WEBSITE_BUCKET_NAME`.
   - Publish the CloudFront and API URLs to the workflow summary.

3. **CloudFormation Outputs**

   - `CloudFrontUrl` – public game URL to share.
   - `HintApiEndpoint` – base URL for hints (use as `VITE_HINT_API_BASE`).
   - `AssetBucketName`, `HintCacheBucketName`, `WebsiteBucketName` – quick references for configuration.

## Game Flow Summary

1. **Welcome & Intro** – Animated greeting from Chacha and Sabu with “Start Game”.
2. **Mystery Kick-off** – Bini Chachi pleads for help; start investigation.
3. **Investigation** – Tap suspects & clues in a comic garden interface, statements displayed dynamically.
4. **Deduction Puzzle** – Assign clues to suspects via animated chips, call hint API if needed.
5. **Solution** – Feedback for correct/incorrect guesses with witty dialogue and hint prompt.
6. **Score & Replay** – Brain Power score, badges, share stub, and next episode teaser.

## Repository Structure

```
app/                      # React frontend (Vite)
lambda/hint-service/      # Serverless hint generator + asset script
infrastructure/template.yaml  # CloudFormation stack (S3, CloudFront, API GW, Lambda)
.github/workflows/deploy.yml  # CI/CD pipeline
```

## Deployment Checklist

- [ ] Generate and upload comic assets once using `npm run generate:assets`.
- [ ] Populate the `app/.env` file with asset CDN URL and hint API endpoint.
- [ ] Configure all GitHub secrets listed above.
- [ ] Push to `main` or trigger the GitHub Action manually.
- [ ] Grab the published CloudFront URL from the workflow summary and document it for players.

## Troubleshooting

- **Build fails due to missing env var** – ensure `.env` has `VITE_ASSET_BASE_URL` and `VITE_HINT_API_BASE`.
- **Lambda errors “OPENAI_API_KEY is not configured”** – confirm the Secrets Manager ARN contains `apiKey` and the IAM role allows retrieval.
- **Assets not loading** – verify objects exist in `ASSET_BUCKET_NAME` and the bucket allows public reads (or use CloudFront signed URLs).
- **Hint API returning cached response** – this is expected; delete the S3 object in `HINT_CACHE_BUCKET_NAME` to force regeneration.

Enjoy solving “The Missing Mangoes” with sharp brains and Chacha-style wit!
