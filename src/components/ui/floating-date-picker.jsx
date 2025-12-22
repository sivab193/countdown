import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronDown, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

// --- SHARED UTILS ---

// Generate strict 15-minute intervals
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const h = hour.toString().padStart(2, '0');
            const m = minute.toString().padStart(2, '0');
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayH = hour % 12 || 12; // Convert to 12h format for display

            slots.push({
                value: `${h}:${m}`,
                label: `${displayH}:${m} ${ampm}` // e.g. "9:15 AM"
            });
        }
    }
    return slots;
};

const TIME_SLOTS = generateTimeSlots();

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Helper to validate date strings rigidly
const validateDateString = (str) => {
    if (!str) return false;
    const d = new Date(str);

    // 1. Basic Validity Check
    if (isNaN(d.getTime())) return false;

    // 2. Rollover Check for MM/DD/YYYY format
    // This prevents 2/31/2025 from being parsed as March 3rd
    const numericParts = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (numericParts) {
        const month = parseInt(numericParts[1], 10);
        const day = parseInt(numericParts[2], 10);
        const year = parseInt(numericParts[3], 10);

        // Check if the Date object matches the input components
        // Note: getMonth() is 0-indexed
        if (d.getFullYear() !== year || d.getMonth() + 1 !== month || d.getDate() !== day) {
            return false;
        }
    }

    return true;
};

/**
 * CUSTOM CALENDAR COMPONENT
 * Features:
 * - Day View
 * - Year View (Activated by clicking the header)
 */
const CustomCalendar = ({ selectedDate, onSelect }) => {
    // Initialize calendar focus to selected date OR today
    const [currentDate, setCurrentDate] = useState(() => {
        return selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
    });

    // Sync internal state if the parent passes a new valid selectedDate (e.g. from typing)
    useEffect(() => {
        if (selectedDate) {
            const d = new Date(selectedDate + 'T00:00:00');
            if (!isNaN(d.getTime())) {
                setCurrentDate(d);
            }
        }
    }, [selectedDate]);

    const [view, setView] = useState('days'); // 'days' | 'years'

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // --- NAVIGATION LOGIC ---
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const startYearWindow = Math.floor(year / 12) * 12;
    const prevYearWindow = () => setCurrentDate(new Date(year - 12, month, 1));
    const nextYearWindow = () => setCurrentDate(new Date(year + 12, month, 1));

    // --- RENDER HELPERS ---

    const renderDays = () => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            // Create local date string YYYY-MM-DD
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            days.push(
                <button
                    key={d}
                    type="button"
                    onClick={() => onSelect(dateStr)}
                    className={cn(
                        "h-8 w-8 rounded-full text-sm flex items-center justify-center transition-all",
                        isSelected
                            ? 'bg-primary text-primary-foreground font-bold shadow-md'
                            : isToday
                                ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                                : 'text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                >
                    {d}
                </button>
            );
        }
        return (
            <div className="grid grid-cols-7 gap-y-1">
                {days}
            </div>
        );
    };

    const renderYears = () => {
        const years = [];
        for (let i = 0; i < 12; i++) {
            const y = startYearWindow + i;
            const isCurrentYear = new Date().getFullYear() === y;
            const isSelectedYear = selectedDate ? parseInt(selectedDate.split('-')[0]) === y : false;

            years.push(
                <button
                    key={y}
                    type="button"
                    onClick={() => {
                        setCurrentDate(new Date(y, month, 1)); // Set year, keep month
                        setView('days');
                    }}
                    className={cn(
                        "py-2 px-1 rounded-lg text-sm font-medium transition-all",
                        isSelectedYear
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : isCurrentYear
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                >
                    {y}
                </button>
            );
        }
        return (
            <div className="grid grid-cols-3 gap-2 mt-2">
                {years}
            </div>
        );
    };

    return (
        <div className="p-4 w-72 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-2xl shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200 select-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={view === 'days' ? prevMonth : prevYearWindow}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    type="button"
                    onClick={() => setView(view === 'days' ? 'years' : 'days')}
                    className="font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                >
                    {view === 'days' ? `${MONTH_NAMES[month]} ${year}` : `${startYearWindow} - ${startYearWindow + 11}`}
                    <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform", view === 'years' ? 'rotate-180' : '')} />
                </button>

                <button
                    type="button"
                    onClick={view === 'days' ? nextMonth : nextYearWindow}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Days Header (Only for days view) */}
            {view === 'days' && (
                <div className="grid grid-cols-7 mb-2">
                    {DAYS.map(day => (
                        <div key={day} className="h-8 w-8 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                            {day}
                        </div>
                    ))}
                </div>
            )}

            {/* Content */}
            {view === 'days' ? renderDays() : renderYears()}
        </div>
    );
};

// Main Component
export function FloatingDatePicker({ value, onChange }) {
    // Parsing initial value if present
    // value format expected: YYYY-MM-DDTHH:mm
    const [selectedDateStr, setSelectedDateStr] = useState('');
    const [time, setTime] = useState('');

    // Sync state with prop value
    useEffect(() => {
        if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                const iso = d.toISOString();
                setSelectedDateStr(iso.split('T')[0]);

                const h = d.getHours().toString().padStart(2, '0');
                const m = d.getMinutes().toString().padStart(2, '0');
                setTime(`${h}:${m}`);

                // Sync input value for consistency
                const displayVal = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                setInputValue(displayVal);
            }
        } else {
            // If value cleared?
            setSelectedDateStr('');
            setTime('');
            setInputValue('');
        }
    }, [value]);

    // Visual input value (what the user types/sees)
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);

    const dateWrapperRef = useRef(null);
    const timeWrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Close dropdowns if clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dateWrapperRef.current && !dateWrapperRef.current.contains(event.target)) {
                setIsDateOpen(false);
            }
            if (timeWrapperRef.current && !timeWrapperRef.current.contains(event.target)) {
                setIsTimeOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedTimeLabel = TIME_SLOTS.find(t => t.value === time)?.label || 'Select Time';

    // Helper to trigger onChange to parent
    const triggerChange = (dStr, tStr) => {
        if (dStr && tStr) {
            // Both key parts present -> Update parent
            const finalIso = `${dStr}T${tStr}`;
            onChange(finalIso);
        } else if (dStr) {
            // If only date is present, maybe default time? Or wait? 
            // Current logic: wait for time. 
            // But maybe default time to 00:00 or current time?
            // Let's default to T00:00 if time not set yet, or keep empty if strict.
            // User's UX implies separated fields. 
            // If we want to be nice, let's just update parent if both are valid.
            // If parent expects a complete date string, we need both.
        }
    };

    // --- DATE HANDLERS ---

    // Called when user selects from Calendar Popover
    const handleCalendarSelect = (dateStr) => {
        setSelectedDateStr(dateStr);
        setError('');

        // Format for display (e.g., Oct 24, 2025)
        // Local processing to avoid timezone jumps for the Display Title
        // We treat dateStr (YYYY-MM-DD) as local components
        const [y, m, d] = dateStr.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d); // Local date

        const displayVal = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        setInputValue(displayVal);
        setIsDateOpen(false);

        // Try to update parent
        triggerChange(dateStr, time || "00:00");
        if (!time) setTime("00:00"); // Default time if picking date first
    };

    // Called when user types manually
    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        setError('');

        if (!val) {
            setSelectedDateStr('');
            return;
        }

        if (validateDateString(val)) {
            const d = new Date(val);
            // Careful with timezone when converting typed MM/DD/YYYY to YYYY-MM-DD
            // If user types 1/1/2025, d is local 1/1/2025 00:00. 
            // We want strict YYYY-MM-DD local components.
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const isoDate = `${year}-${month}-${day}`;

            setSelectedDateStr(isoDate);
            triggerChange(isoDate, time || "00:00");
        }
    };

    // Validate on blur
    const handleInputBlur = () => {
        if (inputValue && !validateDateString(inputValue)) {
            setError('Invalid date. Use MM/DD/YYYY');
            // Do not verify/clear here strictly, let them fix it
        }
    };

    const handleTimeSelect = (tVal) => {
        setTime(tVal);
        setIsTimeOpen(false);
        triggerChange(selectedDateStr, tVal);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row gap-4">

                {/* CUSTOM DATE INPUT PILL */}
                <div className="relative flex-grow" ref={dateWrapperRef}>
                    <label className="absolute -top-5 left-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Date
                    </label>

                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="MM/DD/YYYY"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onFocus={() => setIsDateOpen(true)}
                            className={cn(
                                "block w-full pl-11 pr-4 py-3 text-sm font-medium text-foreground rounded-full border shadow-sm outline-none transition-all placeholder:text-muted-foreground/50 placeholder:font-normal",
                                error
                                    ? 'border-destructive ring-2 ring-destructive/10 bg-destructive/5'
                                    : isDateOpen
                                        ? 'border-purple-500 ring-4 ring-purple-500/10 bg-background'
                                        : 'border-input bg-background hover:border-purple-500/50 hover:shadow-md'
                            )}
                        />
                        <CalendarIcon
                            className={cn(
                                "absolute left-4 top-3.5 h-4 w-4 transition-colors pointer-events-none",
                                error ? 'text-destructive' : (inputValue || isDateOpen ? 'text-purple-500' : 'text-muted-foreground')
                            )}
                        />
                    </div>

                    {/* Error Message Hidden per request, purely relying on border highlight */}

                    {/* Custom Calendar Popover */}
                    {isDateOpen && !error && (
                        <div className="absolute top-full left-0 mt-2 z-50">
                            <CustomCalendar
                                selectedDate={selectedDateStr}
                                onSelect={handleCalendarSelect}
                            />
                        </div>
                    )}
                </div>

                {/* CUSTOM TIME PILL */}
                <div className="relative min-w-[170px]" ref={timeWrapperRef}>
                    <label className="absolute -top-5 left-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Time
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsTimeOpen(!isTimeOpen)}
                        className={cn(
                            "w-full h-full flex items-center justify-between px-4 py-3 rounded-full border shadow-sm transition-all outline-none",
                            isTimeOpen
                                ? 'border-primary ring-4 ring-primary/10 bg-background'
                                : 'border-input bg-background hover:border-primary/50 hover:shadow-md'
                        )}
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Clock className={cn("h-4 w-4 flex-shrink-0", time ? 'text-primary' : 'text-muted-foreground')} />
                            <span className={cn("text-sm font-medium truncate", time ? 'text-foreground' : 'text-muted-foreground')}>
                                {selectedTimeLabel}
                            </span>
                        </div>
                        <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform duration-200", isTimeOpen ? 'rotate-180' : '')} />
                    </button>

                    {/* Time Dropdown Menu */}
                    {isTimeOpen && (
                        <div className="absolute top-full right-0 mt-2 w-full min-w-[180px] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-2xl shadow-xl border border-border max-h-72 overflow-y-auto z-50 p-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right custom-scrollbar">
                            {TIME_SLOTS.map((slot) => (
                                <button
                                    key={slot.value}
                                    type="button"
                                    onClick={() => handleTimeSelect(slot.value)}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 text-sm rounded-xl mb-1 transition-all flex items-center justify-between group",
                                        time === slot.value
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    )}
                                >
                                    {slot.label}
                                    {time === slot.value && <Check className="h-3.5 w-3.5" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
