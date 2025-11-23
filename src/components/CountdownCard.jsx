"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, toZonedTime } from "date-fns-tz";
import { cn } from "@/lib/utils";
import { FlipNumber } from "./FlipNumber";

export function CountdownCard({ event, onDelete, onEdit, isAdmin }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isEventPast, setIsEventPast] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const timeZone = event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

            // Interpret the event.date string as being in the specified timezone
            // toZonedTime parses the date string and returns a Date object representing
            // that specific moment in time, adjusted for the target timezone's offset.
            const eventDate = toZonedTime(event.date, timeZone);

            const isPast = now > eventDate;
            setIsEventPast(isPast);

            const diff = Math.abs(eventDate - now);

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [event.date, event.timezone]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={cn(
                "relative overflow-hidden rounded-xl p-6 shadow-lg backdrop-blur-md border",
                isEventPast
                    ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10"
                    : "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10",
                "transition-all duration-300 group cursor-pointer"
            )}
            onClick={() => isAdmin && onEdit && onEdit(event)}
        >
            {/* Background Gradient Blob */}
            <div
                className={cn(
                    "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-colors duration-500",
                    isEventPast ? "bg-amber-500" : "bg-emerald-500"
                )}
            />

            <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-2xl font-bold tracking-tight text-foreground/90">
                            {event.title}
                        </h3>
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider w-6 h-6 flex items-center justify-center",
                            isEventPast ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"
                        )}>
                            {isEventPast ? "P" : "F"}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-muted-foreground font-medium">
                            {/* Use a suppressHydrationWarning or render only on client to avoid mismatch */}
                            <ClientDate date={event.date} />
                        </p>
                        {event.timezone && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-foreground/10 text-muted-foreground">
                                <ClientTimezone date={new Date()} timezone={event.timezone} />
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                    <TimeUnit value={timeLeft.days} label="Days" color={isEventPast ? "text-amber-500" : "text-emerald-500"} />
                    <TimeUnit value={timeLeft.hours} label="Hrs" color={isEventPast ? "text-amber-500" : "text-emerald-500"} />
                    <TimeUnit value={timeLeft.minutes} label="Min" color={isEventPast ? "text-amber-500" : "text-emerald-500"} />
                    <TimeUnit value={timeLeft.seconds} label="Sec" color={isEventPast ? "text-amber-500" : "text-emerald-500"} />
                </div>
            </div>

            {isAdmin && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-medium px-4 py-2 rounded-full border border-white/20 bg-white/10">
                        Edit Event
                    </span>
                </div>
            )}
        </motion.div>
    );
}

function TimeUnit({ value, label, color }) {
    const digits = value.toString().length;
    const isLarge = digits > 3;
    const isExtraLarge = digits > 4;

    return (
        <div className="flex flex-col items-center p-2 rounded-lg bg-foreground/5 backdrop-blur-sm overflow-hidden">
            <div className={cn(
                "font-black tracking-tight transition-all flex justify-center",
                isExtraLarge ? "text-lg sm:text-xl" : isLarge ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl",
                color
            )}>
                <FlipNumber value={value} color={color} />
            </div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                {label}
            </span>
        </div>
    );
}

function ClientDate({ date }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;
    return <>{format(new Date(date), "MMMM do, yyyy")}</>;
}

function ClientTimezone({ date, timezone }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;
    return <>{format(toZonedTime(date, timezone), "zzzz", { timeZone: timezone })}</>;
}
