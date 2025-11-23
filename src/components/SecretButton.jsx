"use client";

import { Lock } from "lucide-react";

export function SecretButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-4 right-4 p-2 opacity-10 hover:opacity-100 transition-opacity duration-300 rounded-full bg-foreground/5 hover:bg-foreground/10"
            aria-label="Admin Access"
        >
            <Lock className="w-4 h-4" />
        </button>
    );
}
