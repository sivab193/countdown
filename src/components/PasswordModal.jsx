"use client";

import { useState } from "react";
import { Modal } from "./Modal";

export function PasswordModal({ isOpen, onClose, onSuccess }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        try {
            const res = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                onSuccess();
                onClose();
                setPassword("");
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Admin Access">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                        autoFocus
                    />
                    {error && (
                        <p className="text-destructive text-sm mt-2">Incorrect password</p>
                    )}
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Unlock"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
