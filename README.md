# Rahman Chess Academy

Elite international pedagogical institution providing structured FIDE titled development, neural engine training, and Grandmaster apprenticeships. 100% Online Global Academy.

## Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack and React 19)
- **Styling**: Tailwind CSS v4 (Dark theme tokens, gold/amber chess accents)
- **Package Manager**: Bun (`bun install`, `bun run dev`, `bun run build`)
- **Backend**: Firebase Auth & Cloud Firestore (Server SDK + Client SDK)
- **Media**: Cloudinary (Signed client uploads with server-side validation)

---

## Environment Variables

Configure the following variables in `.env.local` (never commit secrets to version control):

| Variable | Description | Client/Server |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin URL (e.g. `https://rahmanchess.com` or `http://localhost:3000`) | Client & Server |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key | Client |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain (e.g. `rahman-chess-academy.firebaseapp.com`) | Client |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID (`rahman-chess-academy`) | Client & Server |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| Firebase Storage Bucket | Client |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Client |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Web App ID | Client |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name (e.g. `npvxsx7y`) | Client & Server |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Cloudinary API Key | Client & Server |
| `CLOUDINARY_API_SECRET` | Cloudinary Secret (used exclusively server-side for signatures) | Server Only |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Admin Project ID (defaults to `NEXT_PUBLIC_FIREBASE_PROJECT_ID`) | Server Only |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase Service Account Email for server admin SDK | Server Only |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase Service Account Private Key (with `\n` linebreaks) | Server Only |

---

## Firebase Setup & Firestore Rules

1. **Firestore Security Rules**:
   Deploy the included `firestore.rules` file to your Firebase project:
   ```bash
   firebase deploy --only firestore:rules
   ```
   The rules allow public read access to content collections (`site_content`, `classes`, `coaches`, `tournaments`, `gallery`, `testimonials`) while denying client-side writes (`allow write: if false;`). Admin writes occur server-side through Next.js route handlers verified with the Admin SDK.

2. **Service Account Credentials**:
   In the Firebase Console, go to **Project Settings** → **Service Accounts** → **Generate New Private Key**. Add `FIREBASE_ADMIN_CLIENT_EMAIL` and `FIREBASE_ADMIN_PRIVATE_KEY` to your environment.

3. **Seeding Content**:
   Log in to `/admin` and click the **Seed Defaults** button to instantly populate Firestore with the baseline grandmaster curriculum, faculty, arenas, and dispatches.

---

## Cloudinary Media Configuration

- Cloudinary assets are organized under `rahman-chess-academy/coaches` and `rahman-chess-academy/gallery`.
- Image uploads are authenticated: the admin UI requests a signed upload signature from `/api/admin/cloudinary-sign` before uploading directly from the browser. The API secret never leaves the server.
- Supported file formats: JPG, PNG, and WebP up to 5 MB.
- Images rendered via `next/image` have automatic format (`f_auto`) and quality (`q_auto`) optimizations applied.

---

## Development & Build Commands

```bash
# Install dependencies using Bun
bun install

# Run local development server
bun run dev

# Run ESLint validation
bun run lint

# Build production bundle
bun run build
```
