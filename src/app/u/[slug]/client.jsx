"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Grid } from "@/components/Grid";
import { CountdownCard } from "@/components/CountdownCard";
import { AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

export function PublicProfileClient({ slug }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profileUser, setProfileUser] = useState(null);

    useEffect(() => {
        if (slug) {
            fetchPublicProfile();
        }
    }, [slug]);

    const fetchPublicProfile = async () => {
        setLoading(true);
        try {
            // 1. Get User ID from slug
            const slugRef = doc(db, "users", slug);
            const slugSnap = await getDoc(slugRef);

            if (!slugSnap.exists()) {
                setError("User not found.");
                setLoading(false);
                return;
            }

            const uid = slugSnap.data().uid;
            setProfileUser({ uid, slug });

            // 2. Fetch Public Events for this UID
            const q = query(
                collection(db, "events"),
                where("userId", "==", uid),
                where("isPublic", "==", true),
                orderBy("date", "asc")
            );

            const querySnapshot = await getDocs(q);
            const publicEvents = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setEvents(publicEvents);
        } catch (err) {
            console.error("Error fetching profile:", err);
            // Indexing error might happen if composite index is missing
            if (err.message.includes("index")) {
                setError("System is indexing public events. Please check back in a few minutes.");
            } else {
                setError("Failed to load public profile.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <AlertCircle className="w-12 h-12 mb-4 text-destructive/50" />
                <h2 className="text-xl font-bold mb-2">Oops!</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
            <main className="max-w-7xl mx-auto pt-12">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
                        @{slug}'s Countdowns
                    </h1>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No public countdowns yet.</p>
                    </div>
                ) : (
                    <Grid>
                        <AnimatePresence mode="popLayout">
                            {events.map((event) => (
                                <CountdownCard
                                    key={event.id}
                                    event={event}
                                    // No delete/edit handlers for public view
                                    isAdmin={false}
                                />
                            ))}
                        </AnimatePresence>
                    </Grid>
                )}
            </main>

            <div className="fixed bottom-6 right-6">
                <a
                    href="/"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity text-sm"
                >
                    Create your own
                </a>
            </div>
        </div>
    );
}
