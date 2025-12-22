"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, query, collection, where, getDocs } from "firebase/firestore";
import { Loader2, Copy, Check } from "lucide-react";

export function ProfileModal({ isOpen, onClose, user }) {
    const [slug, setSlug] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [existingSlug, setExistingSlug] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            checkExistingSlug();
        }
    }, [isOpen, user]);

    const checkExistingSlug = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Find if user already has a slug
            // Efficient way: store slug in user profile or query
            // Since we don't have a separate user profile doc yet, we'll query the 'users' collection
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setExistingSlug(querySnapshot.docs[0].id);
            }
        } catch (err) {
            console.error("Error checking slug:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        const cleanSlug = slug.trim().toLowerCase();
        if (cleanSlug.length < 3 || cleanSlug.length > 40) {
            setError("URL must be between 3 and 40 characters.");
            return;
        }
        if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
            setError("Only letters, numbers, and hyphens allowed.");
            return;
        }

        setLoading(true);

        try {
            // Check if taken
            const slugRef = doc(db, "users", cleanSlug);
            const slugSnap = await getDoc(slugRef);

            if (slugSnap.exists()) {
                setError("This URL is already taken.");
                setLoading(false);
                return;
            }

            // Claim it
            await setDoc(slugRef, {
                uid: user.uid,
                createdAt: new Date().toISOString()
            });

            setExistingSlug(cleanSlug);
        } catch (err) {
            console.error(err);
            setError("Failed to claim URL. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const publicUrl = existingSlug ? `${window.location.origin}/u/${existingSlug}` : "";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Public Profile"
        >
            <div className="space-y-6">
                {loading && !existingSlug ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : existingSlug ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                            <h3 className="text-emerald-500 font-bold mb-2">You have a public profile!</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Share this link to show your public countdowns.
                            </p>

                            <div className="flex items-center gap-2 bg-background p-2 rounded border">
                                <code className="flex-1 text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                    {publicUrl}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 hover:bg-muted rounded transition-colors"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Note: Only events marked as "Public" will be visible here.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleClaim} className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Claim a unique URL for your public profile. This cannot be changed later.
                        </p>

                        <div>
                            <label className="block text-sm font-medium mb-1">Custom URL</label>
                            <div className="flex items-center">
                                <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-lg text-muted-foreground text-sm">
                                    /u/
                                </span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="flex-1 p-2 border rounded-r-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="your-name"
                                    minLength={3}
                                    maxLength={40}
                                    required
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                3-40 chars, letters, numbers, and hyphens only.
                            </p>
                        </div>

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
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Claim URL"}
                        </button>
                    </form>
                )}
            </div>
        </Modal>
    );
}
