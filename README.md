# ZeroHour

A modern, responsive, and secure web application for tracking important events. Built with **Next.js 16**, **React 19**, and **Firebase**.

## About

**ZeroHour** is a beautiful, precision-driven progressive web application natively handling complex timezones without breaking a sweat. Seamlessly track when an event is happening anywhere in the world and claim a unique `/username` link to share your public moments dynamically over social media with auto-generated OG image cards.

## Features

*   **⏱️ Precision Tracking**: Count down to (or up from) events with real-time updates.
*   **🌍 Smart Timezone Support**: Stop worrying about mental math. Set an event for "Tokyo Time" and watch it track accurately.
*   **📱 Progressive Web App (PWA)**: Install ZeroHour directly to your iOS or Android home screen for quick offline-ready access.
*   **🏷️ Event Categories**: Organize your moments with customizable tags like Birthdays, Vacations, and Movies.
*   **🎨 Custom Display Formats**: Choose between Days/Hrs/Min/Sec, Weeks, Months, or Total Days.
*   **🌐 Public Profiles & OG Sharing**: Claim a unique username and share your public events with the world. Social links instantly generate beautiful previews!
*   **🔒 Secure Authentication**: Google sign-in powered by Firebase Authentication.
*   **📊 Live Platform Stats**: Real-time counters for users, public events, and site visits using optimized Firestore counters.
*   **🤖 AI Auto-Fix (Gemini 1.5 Flash)**: Integrated GitHub Action automatically analyzes any newly created issue labeled `bug` and proactively opens a Pull Request with a proposed fix.

## Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Library**: React 19
*   **Styling**: Tailwind CSS + Framer Motion
*   **Backend / Auth**: Firebase (Firestore & Authentication)
*   **Date Handling**: `date-fns` & `date-fns-tz`
*   **PWA**: `@ducanh2912/next-pwa`
*   **Dynamic OG**: `@vercel/og` (`next/og`)
*   **CI/CD Intelligence**: GitHub Actions + Gemini 1.5 Flash API

## Getting Started & Deployment

### 1. Prerequisites
*   Node.js 18+
*   npm or pnpm
*   A Firebase Project (Firestore + Authentication with Google provider)
*   A Vercel Account (for hosting)

### 2. Local Setup
Clone the repository and install dependencies:
```bash
git clone https://github.com/yourusername/countdown.git
cd countdown
npm install
```

Create a `.env.local` file in the root directory and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_SITE_TITLE="ZeroHour"
```
Run `npm run dev` and navigate to `http://localhost:3000`.

### 3. Firebase Setup

#### Deploy Firestore Rules & Indexes
```bash
npm install -g firebase-tools
firebase login
firebase init firestore    # select your project, point to existing files
firebase deploy --only firestore
```

This deploys both `firestore.rules` (security rules) and `firestore.indexes.json` (composite indexes required for multi-field queries).

#### Required Firestore Structure
The app expects these collections:
- **`events`** — User countdown events (auto-created on first add)
- **`users`** — Public profile slugs (auto-created on profile claim)
- **`stats/counters`** — Platform stats document with `users`, `publicEvents`, `visits` fields (auto-initialized on first page view)

### 4. Deploying on Vercel
Add the following **Environment Variables** in your Vercel Project Settings:

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`
*   `NEXT_PUBLIC_SITE_TITLE` (optional — defaults to "ZeroHour")

### 5. Enable AI Auto-Fix PRs (GitHub)
This repository includes a workflow (`issue-to-pr.yml`) that listens for new issues labeled `bug`. It feeds the issue to **Gemini 1.5 Flash** and automatically opens a Pull Request with the proposed fix.

To enable on your fork:
1. Go to **Settings** > **Secrets and variables** > **Actions**.
2. Add a secret named **`GEMINI_API_KEY`** with your Gemini API key.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
```

**Maintenance scripts:**
```bash
# Data integrity check — validates counters, finds orphans, checks homepage events
node --env-file=.env.local scripts/check-integrity.mjs

# Auto-fix integrity issues (corrects counters, deletes orphans)
node --env-file=.env.local scripts/check-integrity.mjs --fix
```

## Security

*   **Firestore Rules**: Production-ready security rules (`firestore.rules`) ensure users can only modify their own data. Public events are readable by anyone.
*   **Stats**: The `stats` collection is publicly writable for anonymous visit counters.

## License

This project is open source and available under the [MIT License](LICENSE).
