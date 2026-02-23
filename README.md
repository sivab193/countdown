# Countdowns

A modern, responsive, and secure web application for tracking important events. Built with **Next.js 16**, **React 19**, and **Firebase**.

![Dashboard Preview](https://placehold.co/800x400?text=Countdowns+Dashboard)

## About

**Countdowns** is a beautiful, precision-driven progressive web application natively handling complex timezones without breaking a sweat. Seamlessly track when an event is happening anywhere in the world and claim a unique `/u/username` link to share your public moments dynamically over social media with auto-generated OG image cards.

## Features

*   **⏱️ Precision Tracking**: Count down to (or up from) events with real-time updates.
*   **🌍 Smart Timezone Support**: Stop worrying about mental math. Set an event for "Tokyo Time" and watch it track accurately.
*   **📱 Progressive Web App (PWA)**: Install Countdowns directly to your iOS or Android home screen for quick offline-ready access.
*   **🏷️ Event Categories**: Organize your moments with customizable tags like Birthdays, Vacations, and Movies.
*   **🎨 Custom Display Formats**: Choose between Days/Hrs/Min/Sec, Weeks, Months, or Total Days.
*   **🌐 Public Profiles & OG Sharing**: Claim a unique username and share your public events with the world. Social links instantly generate beautiful previews!
*   **🔒 Secure Authentication**: Email/Password authentication with strong password enforcement logic powered by Firebase.
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
*   A Firebase Project
*   A GitHub Account (for CI/CD auto-PR generation)
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
```
Run `npm run dev` and navigate to `http://localhost:3000`.

### 3. Deploying on Vercel
To fork and host this on your own Vercel account, you must add the following **Environment Variables** in your Vercel Project Settings during deployment:

*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
*   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
*   `NEXT_PUBLIC_FIREBASE_APP_ID`

Without these secrets, the client-side Firebase Auth and Firestore components will fail to initialize.

### 4. Enable AI Auto-Fix PRs (GitHub)
This repository includes a powerful workflow (`issue-to-pr.yml`) that listens for new issues labeled `bug`. It feeds the issue description and your entire codebase context to the **Gemini 1.5 Flash** model, and automatically opens a Pull Request with the proposed solution!

To enable this on your fork:
1. Go to your GitHub Repository **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**.
3. Name it **`GEMINI_API_KEY`**.
4. Paste your free Gemini API key (obtainable from Google AI Studio).

Now, whenever you label an issue as `bug`, the AI will solve it for you!

## Security

*   **Firestore Rules**: Production-ready security rules (`firestore.rules`) ensure users can only modify their own data.
*   **Validation**: Robust input validation prevents bad data and ensures password strength.

## License

This project is open source and available under the [MIT License](LICENSE).
