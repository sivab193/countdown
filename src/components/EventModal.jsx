"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Trash2 } from "lucide-react";

export function EventModal({ isOpen, onClose, onSave, onDelete, event }) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDate(event.date);
            setTimezone(event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
        } else {
            setTitle("");
            setDate("");
            setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
    }, [event, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: event?.id,
            title,
            date,
            timezone,
        });
        onClose();
    };

    const timezones = Intl.supportedValuesOf("timeZone");

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
                <div>
                    <label className="block text-sm font-medium mb-1">Date & Time</label>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Timezone</label>
                    <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full p-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none"
                    >
                        {timezones.map((tz) => (
                            <option key={tz} value={tz}>
                                {tz}
                            </option>
                        ))}
                    </select>
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

