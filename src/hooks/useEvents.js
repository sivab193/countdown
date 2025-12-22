"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    where
} from "firebase/firestore";
import { TEMPLATE_EVENTS } from "@/lib/constants";

export function useEvents(user) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            // Sort template events: Oldest (Left) -> Newest (Right)
            const sortedTemplates = [...TEMPLATE_EVENTS].sort((a, b) => new Date(a.date) - new Date(b.date));
            setEvents(sortedTemplates);
            setLoading(false);
            return;
        }

        setLoading(true);
        // Explicitly order by date asc for logged in users
        const q = query(
            collection(db, "events"),
            where("userId", "==", user.uid),
            orderBy("date", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Double ensure sort in client just in case
            eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
            setEvents(eventsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addEvent = async (eventData) => {
        if (!user) return;
        // Validate date
        if (!eventData.date || isNaN(new Date(eventData.date).getTime())) {
            console.error("Attempted to save invalid date:", eventData);
            alert("Please select a valid date.");
            return;
        }

        try {
            // Remove undefined fields
            const cleanData = Object.fromEntries(
                Object.entries(eventData).filter(([_, v]) => v !== undefined)
            );

            await addDoc(collection(db, "events"), {
                ...cleanData,
                userId: user.uid,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const updateEvent = async (eventData) => {
        if (!user) return;
        // Validate date
        if (!eventData.date || isNaN(new Date(eventData.date).getTime())) {
            console.error("Attempted to save invalid date:", eventData);
            alert("Please select a valid date.");
            return;
        }

        try {
            const eventRef = doc(db, "events", eventData.id);
            // Remove undefined fields
            const cleanData = Object.fromEntries(
                Object.entries(eventData).filter(([_, v]) => v !== undefined)
            );
            await updateDoc(eventRef, cleanData);
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const deleteEvent = async (id) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, "events", id));
        } catch (e) {
            console.error("Error deleting event: ", e);
        }
    };

    return { events, addEvent, updateEvent, deleteEvent, loading };
}
