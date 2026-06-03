# Saudi Manpower Platform

A modern, highly-secure marketplace connecting verified manual workers (electricians, plumbers, etc.) with licensed contractors in Saudi Arabia. 

Built with the Next.js App Router, Firebase Server Actions, and Tailwind CSS (v4) with `shadcn/ui`.

## Features
- **Strict Role-Based Access Control (RBAC):** Users are securely segregated into Worker, Contractor, or Admin roles via Firebase Custom Claims and Firestore rules.
- **AI-Powered Document Extraction:** Automated Iqama and TUB card OCR extraction for fast worker onboarding.
- **Contractor Dashboard:** Seamless job posting and applicant tracking.
- **Admin Control Center:** Gated moderation queue for manual verification of AI extractions.
- **Premium Aesthetics:** Utilizing a modern, Saudi-inspired design system (`#1e7a41`) tailored for both Light and Dark modes.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4, `shadcn/ui`
- **Database/Auth:** Firebase Auth, Firestore
- **Backend:** Next.js Server Actions (using `firebase-admin`)

## Local Development
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and populate your Firebase credentials.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

See `DEPLOYMENT.md` for production deployment instructions.
