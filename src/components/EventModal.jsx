"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Trash2 } from "lucide-react";
import { COMMON_TIMEZONES } from "@/lib/constants";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { FloatingDatePicker } from "@/components/ui/floating-date-picker";

export function EventModal({ isOpen, onClose, onSave, onDelete, event }) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [displayFormat, setDisplayFormat] = useState("default");
    const [isPublic, setIsPublic] = useState(false);
    const [category, setCategory] = useState("Other");

    const CATEGORIES = ["Other", "Birthdays", "Movies", "Work", "Vacations", "Anniversaries"];

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDate(event.date);
            setTimezone(event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
            setDisplayFormat(event.displayFormat || "default");
            setIsPublic(event.isPublic || false);
            setCategory(event.category || "Other");
        } else {
            setTitle("");
            setDate("");
            setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
            setDisplayFormat("default");
            setIsPublic(false);
            setCategory("Other");
        }
    }, [event, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: event?.id,
            title,
            date,
            timezone,
            displayFormat,
            isPublic,
            category,
        });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={event ? "Edit Event" : "Add Event"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                        required
                    />
                </div>
                <div className="pt-6">
                    <FloatingDatePicker value={date} onChange={setDate} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Timezone</label>
                    <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full p-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                    >
                        {COMMON_TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                                {tz.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Display Format</label>
                    <select
                        value={displayFormat}
                        onChange={(e) => setDisplayFormat(e.target.value)}
                        className="w-full p-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                    >
                        <option value="default">Default (Days/Hrs/Min/Sec)</option>
                        <option value="weeks">Weeks (Wks/Days/Hrs/Min/Sec)</option>
                        <option value="months">Months (Mths/Days/Hrs/Min/Sec)</option>
                        <option value="days_only">Total Days Only</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium">
                        Public Event (Visible on your public profile)
                    </label>
                </div>
                <div className="flex justify-between items-center pt-4">
                    {event && onDelete ? (
                        <button
                            type="button"
                            onClick={() => {
                                onDelete(event.id);
                                onClose();
                            }}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    ) : (
                        <div />
                    )}
                    <button
                        type="submit"
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
}

