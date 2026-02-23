import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, addDoc } from "firebase/firestore";

// Setup Firebase config using the current env variables
// Run this script using: node --env-file=.env.local cloneEvent.mjs <EVENT_ID>
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cloneEvent() {
    // Get the event ID and number of clones from command line arguments
    const eventId = process.argv[2];
    const numClones = parseInt(process.argv[3]) || 1; // Default to 1 if not provided or invalid

    if (!eventId) {
        console.error("❌ Error: Please provide an event ID to clone.");
        console.log("Usage: node --env-file=.env.local cloneEvent.mjs <EVENT_ID> [<NUM_CLONES>]");
        process.exit(1);
    }

    try {
        console.log(`🔍 Fetching event ${eventId}...`);
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        if (!eventSnap.exists()) {
            console.error(`❌ Error: Event with ID ${eventId} not found.`);
            process.exit(1);
        }

        const originalData = eventSnap.data();

        // Exclude the old ID if it exists in the document fields
        const { id, ...dataToClone } = originalData;

        console.log(`📝 Cloning ${numClones} time(s) into new documents...`);
        const eventsCollection = collection(db, "events");

        for (let i = 0; i < numClones; i++) {
            // Append a suffix to the title
            const clonedData = {
                ...dataToClone,
                title: numClones > 1 ? `${dataToClone.title} (Clone ${i + 1})` : `${dataToClone.title} (Clone)`,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(eventsCollection, clonedData);
            console.log(`✅ Success! Event cloned. New ID: ${docRef.id}`);
        }

        console.log(`🎉 Finished cloning ${numClones} events.`);
        process.exit(0);

    } catch (error) {
        console.error("❌ Failed to clone event:", error);
        process.exit(1);
    }
}

cloneEvent();
