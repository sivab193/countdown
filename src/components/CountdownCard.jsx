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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={cn(
                "relative overflow-hidden rounded-xl p-6 shadow-lg backdrop-blur-md border aspect-square flex flex-col",
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

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-1">
                            {event.category && event.category !== "Other" && (
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-foreground/5 px-2 py-0.5 rounded-full w-fit">
                                    {event.category}
                                </span>
                            )}
                            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground/90 line-clamp-2">
                                {event.title}
                            </h3>
                        </div>
                        {/* Status Badge */}
                        <span className={cn(
                            "shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider w-6 h-6 flex items-center justify-center",
                            isEventPast ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"
                        )}>
                            {isEventPast ? "P" : "F"}
                        </span>
                    </div>

                    <div className="text-sm text-muted-foreground font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
                        <ClientDate date={event.date} />
                        <span className="hidden sm:inline text-muted-foreground/30">•</span>
                        <ClientTime date={event.date} timezone={event.timezone} />
                        {event.timezone && (
                            <span className="text-[10px] uppercase font-bold tracking-wider bg-foreground/5 px-1.5 py-0.5 rounded text-muted-foreground/70">
                                <ClientTimezone date={new Date()} timezone={event.timezone} />
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-3 text-center w-full">
                    {format === "months" && <TimeUnit value={timeLeft.months} label="Mths" color={isEventPast ? "text-amber-500" : "text-emerald-500"} />}
                    {format === "weeks" && <TimeUnit value={timeLeft.weeks} label="Wks" color={isEventPast ? "text-amber-500" : "text-emerald-500"} />}

                    <TimeUnit value={timeLeft.days} label="Days" color={isEventPast ? "text-amber-500" : "text-emerald-500"} />

                    {format !== "days_only" && (
                        <>
                            <TimeUnit value={timeLeft.hours} label="Hrs" color={isEventPast ? "text-amber-500" : "text-emerald-500"} />
                            <TimeUnit value={timeLeft.minutes} label="Min" color={isEventPast ? "text-amber-500" : "text-emerald-500"} />
                            <TimeUnit value={timeLeft.seconds} label="Sec" color={isEventPast ? "text-amber-500" : "text-emerald-500"} />
                        </>
                    )}
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

    // Dynamic sizing helper
    // For square card layout, we need to be careful with width to fit 4-5 items
    // We'll use flex-1 to distribute space evenly or min-width

    let sizeClass = "text-xl sm:text-2xl";
    let widthClass = "min-w-[55px] sm:min-w-[65px]";

    if (digits > 4) {
        sizeClass = "text-lg sm:text-xl";
        widthClass = "min-w-[70px] px-1";
    } else if (digits > 2) {
        widthClass = "min-w-[65px] sm:min-w-[75px] px-1";
    }

    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg bg-foreground/5 backdrop-blur-sm overflow-hidden transition-all duration-300 flex-1",
            widthClass
        )}>
            <div className={cn(
                "font-black tracking-tight flex justify-center w-full",
                sizeClass,
                color
            )}>
                <FlipNumber value={value} color={color} />
            </div>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-1">
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
