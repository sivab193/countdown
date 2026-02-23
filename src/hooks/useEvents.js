"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    increment
} from "firebase/firestore";

const countersRef = doc(db, "stats", "counters");

export function useEvents(user) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let q;
        if (!user) {
            // Unauthenticated users: fetch homepage-designated public events
            q = query(
                collection(db, "events"),
                where("userId", "==", "homepage"),
                where("isPublic", "==", true),
                orderBy("date", "asc")
            );
        } else {
            // Authenticated users fetching their own dashboard events
            q = query(
                collection(db, "events"),
                where("userId", "==", user.uid),
                orderBy("date", "asc")
            );
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
            setEvents(eventsData);
            setLoading(false);
        }, (error) => {
            console.error("Firestore error in useEvents:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addEvent = async (eventData) => {
        if (!user) return;
        if (!eventData.date || isNaN(new Date(eventData.date).getTime())) {
            console.error("Attempted to save invalid date:", eventData);
            alert("Please select a valid date.");
            return;
        }

        try {
            const cleanData = Object.fromEntries(
                Object.entries(eventData).filter(([_, v]) => v !== undefined)
            );

            await addDoc(collection(db, "events"), {
                ...cleanData,
                userId: user.uid,
                createdAt: new Date().toISOString()
            });

            // Update public events counter if the new event is public
            if (eventData.isPublic) {
                await updateDoc(countersRef, { publicEvents: increment(1) }).catch(() => { });
            }
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const updateEvent = async (eventData) => {
        if (!user) return;
        if (!eventData.date || isNaN(new Date(eventData.date).getTime())) {
            console.error("Attempted to save invalid date:", eventData);
            alert("Please select a valid date.");
            return;
        }

        try {
            const eventRef = doc(db, "events", eventData.id);

            // Check if isPublic toggled
            const oldSnap = await getDoc(eventRef);
            const wasPublic = oldSnap.exists() ? oldSnap.data().isPublic : false;
            const isNowPublic = eventData.isPublic || false;

            const cleanData = Object.fromEntries(
                Object.entries(eventData).filter(([_, v]) => v !== undefined)
            );
            await updateDoc(eventRef, cleanData);

            // Adjust public events counter on toggle
            if (!wasPublic && isNowPublic) {
                await updateDoc(countersRef, { publicEvents: increment(1) }).catch(() => { });
            } else if (wasPublic && !isNowPublic) {
                await updateDoc(countersRef, { publicEvents: increment(-1) }).catch(() => { });
            }
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const deleteEvent = async (id) => {
        if (!user) return;
        try {
            // Check if the event being deleted was public
            const eventRef = doc(db, "events", id);
            const snap = await getDoc(eventRef);
            const wasPublic = snap.exists() ? snap.data().isPublic : false;

            await deleteDoc(eventRef);

            // Decrement public events counter if it was public
            if (wasPublic) {
                await updateDoc(countersRef, { publicEvents: increment(-1) }).catch(() => { });
            }
        } catch (e) {
            console.error("Error deleting event: ", e);
        }
    };

    return { events, addEvent, updateEvent, deleteEvent, loading };
}
