"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, toZonedTime, fromZonedTime } from "date-fns-tz";
import { cn } from "@/lib/utils";
import { FlipNumber } from "./FlipNumber";

import { intervalToDuration, differenceInWeeks } from "date-fns";

export function CountdownCard({ event, onDelete, onEdit, isAdmin }) {
    const [timeLeft, setTimeLeft] = useState(null);
    const [isEventPast, setIsEventPast] = useState(false);
    const [invalidData, setInvalidData] = useState(false);


    useEffect(() => {
        const calculateTime = () => {
            try {
                const now = new Date();
                const timeZone = event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

                // Validate Event Date
                if (!event.date || isNaN(new Date(event.date).getTime())) {
                    setInvalidData(true);
                    return;
                }

                // Find the absolute moment in UTC when it is `event.date` in `timeZone`
                const absoluteEventDate = fromZonedTime(event.date, timeZone);
                if (isNaN(absoluteEventDate.getTime())) {
                    setInvalidData(true);
                    return;
                }

                // If valid, clear invalid state
                setInvalidData(false);

                const isPast = now > absoluteEventDate;
                setIsEventPast(isPast);

                // calculate duration taking the target timezone into account for things like Months and Days
                const start = isPast ? absoluteEventDate : now;
                const end = isPast ? now : absoluteEventDate;

                // Shift both absolute UTC times into the target timezone context to do exact calendar math
                const startZoned = toZonedTime(start, timeZone);
                const endZoned = toZonedTime(end, timeZone);

                // Basic duration for Months/Years using the timezone-aligned dates
                const duration = intervalToDuration({ start: startZoned, end: endZoned });

                // Total difference for manual calcs
                const diff = Math.abs(absoluteEventDate - now);
                const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24)) || 0;

                let computedTime = {};
                const format = event.displayFormat || "default";

                if (format === "weeks") {
                    const weeks = Math.floor(totalDays / 7);
                    const days = totalDays % 7;
                    computedTime = {
                        weeks,
                        days,
                        hours: duration.hours || 0,
                        minutes: duration.minutes || 0,
                        seconds: duration.seconds || 0
                    };
                } else if (format === "months") {
                    computedTime = {
                        months: ((duration.years || 0) * 12 + (duration.months || 0)) || 0,
                        days: duration.days || 0,
                        hours: duration.hours || 0,
                        minutes: duration.minutes || 0,
                        seconds: duration.seconds || 0
                    };
                } else if (format === "days_only") {
                    computedTime = {
                        days: totalDays
                    };
                } else {
                    // Default: Days, Hours, Minutes, Seconds
                    computedTime = {
                        days: totalDays,
                        hours: Math.floor((diff / (1000 * 60 * 60)) % 24) || 0,
                        minutes: Math.floor((diff / 1000 / 60) % 60) || 0,
                        seconds: Math.floor((diff / 1000) % 60) || 0
                    };
                }

                setTimeLeft(computedTime);
            } catch (err) {
                console.error("Error calculating time for event:", event.id, err);
                // Don't crash, just show zeros or invalid state
                setInvalidData(true);
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [event.date, event.timezone, event.displayFormat]);

    if (!timeLeft) return null;

    if (invalidData) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative overflow-hidden rounded-3xl bg-destructive/10 border border-destructive/20 p-6 sm:p-8 backdrop-blur-sm"
            >
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <span className="text-destructive font-bold text-xl uppercase tracking-widest">
                        Data Error
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-foreground">{event.title}</h2>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        This event has invalid date data. Please edit it to fix the date.
                    </p>

                    {isAdmin && (
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => onEdit(event)}
                                className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-bold hover:opacity-90"
                            >
                                Edit Event
                            </button>
                            <button
                                onClick={() => onDelete(event.id)}
                                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-full text-sm font-bold hover:opacity-90"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }


    const format = event.displayFormat || "default";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
                "relative overflow-hidden rounded-3xl p-4 sm:p-5 lg:p-4 backdrop-blur-xl border border-white/10 shadow-2xl",
                "h-[220px] sm:h-[280px] lg:h-[230px] w-full flex flex-col justify-between",
                isEventPast
                    ? "bg-amber-950/20 hover:bg-amber-900/20 border-amber-500/20"
                    : "bg-emerald-950/20 hover:bg-emerald-900/20 border-emerald-500/20",
                "transition-all duration-300 group cursor-pointer",
                "hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)]"
            )}
            onClick={() => isAdmin && onEdit && onEdit(event)}
        >
            {/* Background Gradient Blob */}
            <div
                className={cn(
                    "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 transition-colors duration-500",
                    isEventPast ? "bg-amber-500" : "bg-emerald-500"
                )}
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2 min-h-[52px]">
                        <div className="flex flex-col gap-1 w-full pr-2">
                            {event.category && event.category !== "Other" ? (
                                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full w-fit">
                                    {event.category}
                                </span>
                            ) : (
                                <span className="h-[20px] w-full block"></span>
                            )}
                            <h3 className="text-2xl font-black tracking-tighter text-white line-clamp-2 leading-tight drop-shadow-sm">
                                {event.title}
                            </h3>
                        </div>
                        {/* Status Badge — Pill shaped */}
                        <span className={cn(
                            "shrink-0 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border whitespace-nowrap flex items-center justify-center",
                            isEventPast
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        )}>
                            {isEventPast ? "Past" : "Upcoming"}
                        </span>
                    </div>

                    <div className="text-sm text-emerald-100/70 font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
                        <ClientDate date={event.date} />
                        <span className="text-emerald-100/40">•</span>
                        <ClientTime date={event.date} timezone={event.timezone} />
                        {event.timezone && (
                            <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-100/90">
                                <ClientTimezone date={new Date()} timezone={event.timezone} />
                            </span>
                        )}
                    </div>
                </div>

                <div className={cn(
                    "grid gap-2 sm:gap-3 w-full",
                    isEventPast ? "opacity-50" : "opacity-100",
                    format === "months" ? "grid-cols-5" : format === "weeks" ? "grid-cols-5" : format === "days_only" ? "grid-cols-1" : "grid-cols-4"
                )}>
                    {format === "months" && <TimeUnit value={timeLeft.months} label="Mths" isEventPast={isEventPast} />}
                    {format === "weeks" && <TimeUnit value={timeLeft.weeks} label="Wks" isEventPast={isEventPast} />}

                    <TimeUnit value={timeLeft.days} label="Days" isEventPast={isEventPast} />

                    {format !== "days_only" && (
                        <>
                            <TimeUnit value={timeLeft.hours} label="Hrs" isEventPast={isEventPast} />
                            <TimeUnit value={timeLeft.minutes} label="Min" isEventPast={isEventPast} />
                            <TimeUnit value={timeLeft.seconds} label="Sec" isEventPast={isEventPast} />
                        </>
                    )}
                </div>
            </div>

            {isAdmin && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm rounded-xl">
                    <span className="text-white font-medium px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10">
                        Edit Event
                    </span>
                </div>
            )}
        </motion.div>
    );
}

function TimeUnit({ value, label, isEventPast }) {
    const digits = value.toString().length;

    let sizeClass = "text-lg sm:text-xl";
    let widthClass = "px-1 sm:px-2 min-w-0 flex-1";

    if (digits >= 4) {
        sizeClass = "text-sm sm:text-base";
    } else if (digits === 3) {
        sizeClass = "text-base sm:text-lg";
    }

    const color = isEventPast ? "text-amber-500" : "text-emerald-400";

    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-1.5 sm:py-2.5 lg:py-1.5 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300",
            widthClass,
            isEventPast ? "opacity-70 grayscale-[0.5]" : ""
        )}>
            <div className={cn(
                "font-black tracking-tighter flex justify-center items-center w-full",
                sizeClass,
                color
            )}>
                <FlipNumber value={value} color={color} />
            </div>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-500 tracking-wider mt-1 whitespace-nowrap">
                {label}
            </span>
        </div>
    );
}

function ClientDate({ date }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted || !date) return null;
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return <span className="text-destructive">Invalid Date</span>;
        return <>{format(d, "MMMM do, yyyy")}</>;
    } catch (e) {
        return null;
    }
}

function ClientTime({ date, timezone }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted || !date) return <span className="opacity-0">00:00</span>; // Prevent layout shift
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;
        // Use timezone if provided, else browser local
        const z = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        return <>{format(toZonedTime(d, z), "h:mm a", { timeZone: z })}</>;
    } catch (e) {
        return null;
    }
}

function ClientTimezone({ date, timezone }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;
    try {
        // Return just the offset ex: GMT+5:30
        return <>{format(toZonedTime(date, timezone), "'GMT'xxx", { timeZone: timezone })}</>;
    } catch (e) {
        return null;
    }
}
