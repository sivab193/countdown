"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { auth } from "@/lib/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";
// Helper to check password strength
function getPasswordCriteria(password) {
    return [
        { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
        { id: 'upper', label: 'One uppercase letter', met: /[A-Z]/.test(password) },
        { id: 'lower', label: 'One lowercase letter', met: /[a-z]/.test(password) },
        { id: 'number', label: 'One number', met: /\d/.test(password) },
        { id: 'special', label: 'One special character (#@$!%*?&)', met: /[#@$!%*?&]/.test(password) },
    ];
}

import { Check, X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LoginModal({ isOpen, onClose }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    // Strong password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isSignUp) {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match.");
                }
                if (!STRONG_PASSWORD_REGEX.test(password)) {
                    throw new Error("Please meet all password requirements.");
                }

                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    const criteria = getPasswordCriteria(password);
    const passwordsMatch = password && confirmPassword && password === confirmPassword;

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isSignUp ? "Create Account" : "Welcome Back"}
        >
            <div className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                            required
                        />
                        {isSignUp && (
                            <div className="mt-2 text-xs space-y-1">
                                {criteria.map((item) => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        {item.met ? (
                                            <Check className="w-3 h-3 text-emerald-500" />
                                        ) : (
                                            <X className="w-3 h-3 text-muted-foreground/50" />
                                        )}
                                        <span className={item.met ? "text-emerald-500" : "text-muted-foreground"}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <AnimatePresence initial={false}>
                        {isSignUp && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <label className="block text-sm font-medium mb-1 mt-2">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                                <div className="mt-2 text-xs flex items-center gap-2">
                                    {passwordsMatch ? (
                                        <Check className="w-3 h-3 text-emerald-500" />
                                    ) : (
                                        <X className="w-3 h-3 text-muted-foreground/50" />
                                    )}
                                    <span className={passwordsMatch ? "text-emerald-500" : "text-muted-foreground"}>
                                        Passwords match
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSignUp ? "Sign Up" : "Sign In")}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    </span>
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary hover:underline font-medium"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
