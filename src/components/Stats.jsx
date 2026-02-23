"use client";

import { useState, useEffect } from "react";
import { Users, Eye, BarChart3, Globe2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, setDoc, increment, getDoc } from "firebase/firestore";

export function Stats() {
    const [statsData, setStatsData] = useState({
        users: 0,
        publicEvents: 0,
        visits: 0,
        loading: true,
        isOffline: false
    });

    useEffect(() => {
        const countersRef = doc(db, "stats", "counters");

        // Increment visits on mount
        (async () => {
            try {
                await updateDoc(countersRef, { visits: increment(1) });
            } catch {
                // Document might not exist yet — create it
                try {
                    await setDoc(countersRef, { users: 0, publicEvents: 0, visits: 1 }, { merge: true });
                } catch (e) {
                    // Silently ignore if permissions prevent writes
                }
            }
        })();

        // Listen to counters in real-time
        const unsubscribe = onSnapshot(countersRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setStatsData({
                    users: data.users || 0,
                    publicEvents: data.publicEvents || 0,
                    visits: data.visits || 0,
                    loading: false
                });
            } else {
                setStatsData(s => ({ ...s, loading: false }));
            }
        }, (error) => {
            console.error("Error listening to stats:", error);
            setStatsData(s => ({ ...s, loading: false, isOffline: true }));
        });

        return () => unsubscribe();
    }, []);

    const { users, publicEvents, visits, loading, isOffline } = statsData;

    if (isOffline) return null;
    const avgEvents = users > 0 ? (publicEvents / users).toFixed(1) : "0";

    const stats = [
        {
            label: "Registered Users",
            value: loading ? null : users.toLocaleString(),
            icon: <Users className="w-6 h-6 text-emerald-500" />,
        },
        {
            label: "Public Events Shared",
            value: loading ? null : publicEvents.toLocaleString(),
            icon: <Globe2 className="w-6 h-6 text-emerald-500" />,
        },
        {
            label: "Total Site Visits",
            value: loading ? null : visits.toLocaleString(),
            icon: <Eye className="w-6 h-6 text-emerald-500" />,
        },
        {
            label: "Public Events per User",
            value: loading ? null : avgEvents,
            icon: <BarChart3 className="w-6 h-6 text-emerald-500" />,
        }
    ];

    return (
        <section className="w-full py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <div className="text-center mb-12">
                    <p className="text-emerald-500 font-medium text-sm mb-4 tracking-wide uppercase flex items-center justify-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Platform Scale
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Growing securely every day
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white/[0.03] rounded-2xl border border-white/5 p-4 sm:p-6 flex flex-col items-center justify-center text-center hover:border-emerald-500/20 hover:shadow-[0_0_20px_-8px_rgba(16,185,129,0.2)] transition-all duration-300">
                            <div className="bg-emerald-500/10 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                                {stat.icon}
                            </div>
                            {loading ? (
                                <div className="animate-pulse bg-white/10 h-6 sm:h-8 w-16 rounded mx-auto mb-1 sm:mb-2 mt-1"></div>
                            ) : (
                                <h4 className="text-xl sm:text-3xl font-black text-white mb-1 sm:mb-2 tracking-tight">
                                    {stat.value}
                                </h4>
                            )}
                            <p className="text-zinc-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
