"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "firebase/firestore";

export function useEvents() {
    const [events, setEvents] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "events"), orderBy("date", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(eventsData);
            setIsLoaded(true);
        }, (error) => {
            console.error("Error fetching events:", error);
            setIsLoaded(true); // Still set loaded to avoid infinite loading state
        });

        return () => unsubscribe();
    }, []);

    const addEvent = async (event) => {
        try {
            // Remove id if it exists (it might be undefined)
            const { id, ...eventData } = event;
            await addDoc(collection(db, "events"), {
                ...eventData,
                createdAt: new Date().toISOString()
            });
        } catch (e) {
            console.error("Error adding event: ", e);
        }
    };

    const updateEvent = async (updatedEvent) => {
        try {
            const eventRef = doc(db, "events", updatedEvent.id);
            const { id, ...data } = updatedEvent;
            await updateDoc(eventRef, data);
        } catch (e) {
            console.error("Error updating event: ", e);
        }
    };

    const deleteEvent = async (id) => {
        try {
            await deleteDoc(doc(db, "events", id));
        } catch (e) {
            console.error("Error deleting event: ", e);
        }
    };

    return { events, addEvent, updateEvent, deleteEvent, isLoaded };
}
