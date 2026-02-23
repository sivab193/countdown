"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Grid } from "@/components/Grid";
import { CountdownCard } from "@/components/CountdownCard";
import { AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, User, ArrowUp } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Stats } from "@/components/Stats";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = ["All", "Birthdays", "Movies", "Work", "Vacations", "Anniversaries", "Other"];

export function PublicProfileClient({ slug }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profileUser, setProfileUser] = useState(null);
    const [filterCategory, setFilterCategory] = useState("All");

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

    // Dynamic: only show categories that actually exist in events
    const activeCategories = ["All", ...ALL_CATEGORIES.filter(cat => cat !== "All" && events.some(e => (e.category || "Other") === cat))];

    const filteredEvents = events.filter(e => filterCategory === "All" || (e.category || "Other") === filterCategory);

    if (loading) {
        return (
            <div className="min-h-[100dvh] flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-black">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[100dvh] flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-black">
                <AlertCircle className="w-12 h-12 mb-4 text-destructive/50" />
                <h2 className="text-xl font-bold mb-2">Oops!</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className={cn(
            "font-[family-name:var(--font-geist-sans)] relative w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-black",
            "h-[100dvh] overflow-hidden flex flex-col"
        )}>
            {/* Solid Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-white/5 shrink-0">
                <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 py-3 sm:py-4 flex justify-between items-center">
                    <a href="/" className="text-xl sm:text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-emerald-500 hover:opacity-80 transition-opacity">
                        {siteConfig.title}
                    </a>
                    <a
                        href="/"
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 transition-all text-sm font-bold shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20"
                    >
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">Create your own</span>
                        <span className="inline sm:hidden">Create</span>
                    </a>
                </div>
            </header>

            <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-20 pb-20 flex flex-col flex-1 min-h-0">
                {/* Profile Title */}
                <div className="mb-6 pt-4">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
                        @{slug}&apos;s Countdowns
                    </h2>
                </div>

                {/* Dynamic Category Filters */}
                {events.length > 0 && activeCategories.length > 1 && (
                    <div className="flex overflow-x-auto pb-3 mb-4 gap-2 no-scrollbar">
                        {activeCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border", filterCategory === cat ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5")}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Events Grid */}
                {filteredEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center flex-1 min-h-0">
                        <p className="text-zinc-500 text-lg font-medium">No public countdowns yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center flex-1 min-h-0 w-full">
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 w-full pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:pb-0 md:overflow-visible no-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {filteredEvents.map((event) => (
                                    <div key={event.id} className="w-[85vw] sm:w-[60vw] md:w-auto shrink-0 snap-center">
                                        <CountdownCard
                                            event={event}
                                            isAdmin={false}
                                        />
                                    </div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Stats Section */}
                <section className="w-full shrink-0 flex flex-col items-center justify-center relative">
                    <Stats />
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
