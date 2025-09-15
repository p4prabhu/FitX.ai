# FitX.ai Virtual Try‑On — Project Notes and TODO

This document captures the current state of the project and the next actions so we can resume work quickly later.

## Current app behavior
- User uploads a clothing image first; backend detects clothing type (top/bottom/dress).
- User then uploads their own photo.
- Files are uploaded to S3 via pre‑signed URLs and organized by folders.
- “Generate Try‑On” triggers a backend stub (ready to call a real model endpoint).

## Tech stack
- Frontend: React + TypeScript + Vite, Tailwind CSS
- Backend: Node.js + Express
- AWS: S3 (storage), Rekognition (label detection)

## Implemented
- Frontend (`src/App.tsx`)
  - Two‑step flow (clothing → photo)
  - Upload buttons with loading states; double‑click uploads prevented
  - Uses pre‑signed URLs from backend
  - Works with S3 keys (not raw URLs); constructs display URLs from env
  - Env bootstrap via `src/config.ts` (Vite `VITE_` vars) and loaded in `src/main.tsx`
- Backend (`backend/index.js`)
  - `POST /get-presigned-url` → returns pre‑signed PUT URL and generated S3 key
    - Organized prefixes: `clothing-items/`, `user-photos/`, `generated-images/`
  - `POST /detect-clothing-type` → Rekognition DetectLabels to infer clothing type by key
  - `POST /process-image` → placeholder to integrate a real try‑on model (returns mock key)
- S3 structure
  - `clothing-items/` — clothing uploads
  - `user-photos/` — user photos
  - `generated-images/` — model outputs (planned)
- UX hardening
  - Buttons disabled during upload; clear status messages
  - State resets if a new file is chosen

## Environment
- Root `.env` (not committed):
  - `VITE_S3_BUCKET=<your-bucket>`
  - `VITE_AWS_REGION=<your-region>`
- Backend `backend/.env` (not committed):
  - `AWS_REGION=<your-region>`
  - `AWS_ACCESS_KEY_ID=<key>`
  - `AWS_SECRET_ACCESS_KEY=<secret>`
  - `S3_BUCKET_NAME=<your-bucket>`

## Run
- Backend: `cd backend && npm install && node index.js`
- Frontend: `npm install && npm run dev`

## API contracts
- `POST /get-presigned-url`
  - Request: `{ fileName: string, fileType: string, uploadType: 'clothing'|'user-photo'|'generated' }`
  - Response: `{ url: string, key: string }`
- `POST /detect-clothing-type`
  - Request: `{ imageKey: string }`
  - Response: `{ type: 'top'|'bottom'|'dress'|'unknown', confidence: number, allLabels: {name:string,confidence:number}[] }`
- `POST /process-image` (stub)
  - Request: `{ userPhotoKey: string, clothingKey: string, clothingType: string }`
  - Response: `{ success: boolean, processedImageKey?: string, message?: string, error?: string }`

## Security
- Root `.env` and `backend/.env` are git‑ignored. Keep credentials out of git.
- Rotate any secrets that were shared. Principle of least privilege for IAM.

## Next steps (priority)
1. Implement real virtual try‑on inference
   - Preferred: Deploy a specialized VTON model (e.g., StableVITON) on AWS SageMaker as a real‑time endpoint; call it from `/process-image` using S3 keys.
   - Alternative: Prototype with Bedrock image model for a quick POC, then migrate to SageMaker VTON.
2. Pre/post‑processing pipeline
   - For arbitrary images: generate `cloth_mask`, person `agnostic`/`agnostic-mask`, DensePose if required by chosen model.
   - Store intermediates in S3 (temp prefix) with lifecycle rules for cleanup.
3. Replace backend stub
   - `/process-image`: fetch inputs from S3 → invoke model endpoint → write output to `generated-images/` → return final key.
4. Hardening & ops
   - S3 bucket policy, CORS for pre‑signed PUT/GET; retry and longer expiry if needed.
   - Add structured logging and error handling.
5. Product features
   - Gallery/history of generated results (by session or user).
   - Show detected clothing type with manual override.
   - Basic rate limiting.
6. Hackathon deliverables
   - Update `README.md` with setup, architecture diagram, and service usage.
   - Add open‑source license.
   - Record <5‑minute demo video.

## Quick resume checklist
- Ensure `.env` files exist and are valid.
- Backend and frontend start cleanly.
- S3 uploads land under correct prefixes and Rekognition returns a clothing type.
- Implement `/process-image` against the selected model endpoint next.

Last updated: 2025-09-15
