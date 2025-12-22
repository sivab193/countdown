# Countdowns

A modern, responsive, and secure web application for tracking important events. Built with Next.js 16, React 19, and Firebase.

![Dashboard Preview](https://placehold.co/800x400?text=Countdowns+Dashboard)

## Features

*   **⏱️ Precision Tracking**: Count down to (or up from) events with real-time updates.
*   **🎨 Custom Display Formats**: Choose between Days/Hrs/Min/Sec, Weeks, Months, or Total Days.
*   **🌍 Timezone Support**: Smart timezone handling ensures your event connects to the right moment, anywhere in the world.
*   **🔒 Secure Authentication**: Email/Password authentication with strong password enforcement.
*   **🌐 Public Profiles**: Claim a unique username (e.g., `/u/siva`) and share your public events with the world.
*   **📱 Fully Responsive**: A beautiful, glassmorphism-inspired UI that works perfectly on desktop and mobile.

## Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Library**: React 19
*   **Styling**: Tailwind CSS + Framer Motion
*   **Backend / Auth**: Firebase (Firestore & Authentication)
*   **Date Handling**: date-fns & date-fns-tz

## Getting Started

### Prerequisites

*   Node.js 18+
*   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/countdown.git
    cd countdown
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Firebase**
    *   Create a `.env.local` file in the root directory.
    *   Add your Firebase configuration keys:
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY=...
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
        NEXT_PUBLIC_FIREBASE_APP_ID=...
        ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Security

*   **Firestore Rules**: Production-ready security rules (`firestore.rules`) ensure users can only modify their own data.
*   **Validation**: Robust input validation prevents bad data and ensures password strength.

## License

This project is open source and available under the [MIT License](LICENSE).
