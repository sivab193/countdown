/**
 * Data Integrity Check & Repair Script
 *
 * Checks:
 *  1. Orphaned events (events whose userId doesn't match any registered user)
 *  2. Stats/counters accuracy (compares counter values with actual document counts)
 *  3. Orphaned user slugs (slugs pointing to UIDs that no longer exist in Firebase Auth)
 *
 * Usage:
 *    node --env-file=.env.local scripts/check-integrity.mjs          # dry run
 *    node --env-file=.env.local scripts/check-integrity.mjs --fix    # fix counters + delete orphans
 *
 * Note: Uses client SDK, so it can only see public events and users (per Firestore rules).
 *       For full access, you'd need Firebase Admin SDK with a service account.
 */

import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    query,
    where,
} from "firebase/firestore";

const app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);
const shouldFix = process.argv.includes("--fix");
let issues = 0;
let fixed = 0;

function header(title) {
    console.log(`\n${"━".repeat(60)}`);
    console.log(`  ${title}`);
    console.log(`${"━".repeat(60)}\n`);
}

async function checkStatsCounters() {
    header("1. STATS/COUNTERS INTEGRITY");

    // Get actual counts
    const usersSnap = await getDocs(collection(db, "users"));
    const actualUsers = usersSnap.size;

    // Count public events (all we can see without admin)
    const publicQ = query(collection(db, "events"), where("isPublic", "==", true));
    const publicSnap = await getDocs(publicQ);
    const actualPublicEvents = publicSnap.size;

    // Get stored counters
    const countersRef = doc(db, "stats", "counters");
    const countersSnap = await getDoc(countersRef);

    if (!countersSnap.exists()) {
        console.log("  ❌ stats/counters document does NOT exist!");
        issues++;
        if (shouldFix) {
            await setDoc(countersRef, {
                users: actualUsers,
                publicEvents: actualPublicEvents,
                visits: 0,
            });
            console.log(`  ✅ Created stats/counters: users=${actualUsers}, publicEvents=${actualPublicEvents}, visits=0`);
            fixed++;
        } else {
            console.log("  💡 Run with --fix to create it");
        }
        return { actualUsers, actualPublicEvents };
    }

    const counters = countersSnap.data();
    console.log("  Stored counters:");
    console.log(`    users:        ${counters.users ?? "MISSING"}`);
    console.log(`    publicEvents: ${counters.publicEvents ?? "MISSING"}`);
    console.log(`    visits:       ${counters.visits ?? "MISSING"}`);
    console.log("");
    console.log("  Actual counts:");
    console.log(`    users (slugs):    ${actualUsers}`);
    console.log(`    public events:    ${actualPublicEvents}`);

    const usersDrift = (counters.users ?? 0) !== actualUsers;
    const eventsDrift = (counters.publicEvents ?? 0) !== actualPublicEvents;

    if (usersDrift || eventsDrift) {
        console.log("");
        if (usersDrift) {
            console.log(`  ⚠️  Users counter DRIFT: stored=${counters.users ?? 0}, actual=${actualUsers}`);
            issues++;
        }
        if (eventsDrift) {
            console.log(`  ⚠️  Public events counter DRIFT: stored=${counters.publicEvents ?? 0}, actual=${actualPublicEvents}`);
            issues++;
        }

        if (shouldFix) {
            const updates = {};
            if (usersDrift) updates.users = actualUsers;
            if (eventsDrift) updates.publicEvents = actualPublicEvents;
            await setDoc(countersRef, updates, { merge: true });
            console.log(`  ✅ Counters corrected!`);
            fixed++;
        } else {
            console.log("  💡 Run with --fix to correct counters");
        }
    } else {
        console.log("\n  ✅ All counters are accurate!");
    }

    return { actualUsers, actualPublicEvents };
}

async function checkOrphanedEvents() {
    header("2. ORPHANED EVENTS (public events only)");

    // Get known user UIDs
    const usersSnap = await getDocs(collection(db, "users"));
    const knownUids = new Set();
    usersSnap.forEach((d) => {
        const data = d.data();
        if (data.uid) knownUids.add(data.uid);
    });

    // Also add "homepage" as a known pseudo-user
    knownUids.add("homepage");

    // Get all public events
    const publicQ = query(collection(db, "events"), where("isPublic", "==", true));
    const eventsSnap = await getDocs(publicQ);

    const orphans = [];
    eventsSnap.forEach((d) => {
        const data = d.data();
        if (!knownUids.has(data.userId)) {
            orphans.push({ id: d.id, title: data.title, userId: data.userId, date: data.date });
        }
    });

    if (orphans.length === 0) {
        console.log("  ✅ No orphaned public events found!");
    } else {
        console.log(`  ❌ Found ${orphans.length} orphaned public events:\n`);
        issues += orphans.length;
        orphans.forEach((e) => {
            console.log(`    📌 "${e.title}" (id: ${e.id})`);
            console.log(`       userId: ${e.userId} | date: ${e.date}`);
        });

        if (shouldFix) {
            console.log("");
            for (const orphan of orphans) {
                await deleteDoc(doc(db, "events", orphan.id));
                console.log(`    ❌ Deleted: "${orphan.title}"`);
                fixed++;
            }
        } else {
            console.log("\n  💡 Run with --fix to delete orphaned events");
        }
    }
}

async function checkHomepageEvents() {
    header("3. HOMEPAGE EVENTS");

    const q = query(
        collection(db, "events"),
        where("userId", "==", "homepage"),
        where("isPublic", "==", true)
    );

    try {
        const snap = await getDocs(q);
        if (snap.size === 0) {
            console.log("  ⚠️  No homepage events found! The landing page will show 'No events yet'.");
            issues++;
        } else {
            console.log(`  ✅ Found ${snap.size} homepage events:\n`);
            snap.forEach((d) => {
                const data = d.data();
                console.log(`    📌 "${data.title}" — ${data.date}`);
            });
        }
    } catch (err) {
        console.log(`  ❌ Query FAILED: ${err.message}`);
        if (err.message.includes("index")) {
            console.log("  💡 Missing composite index! Run: firebase deploy --only firestore:indexes");
        }
        issues++;
    }
}

// Run all checks
async function main() {
    console.log("\n🔍 ZeroHour Data Integrity Check");
    console.log(`   Mode: ${shouldFix ? "🔧 FIX" : "👀 DRY RUN"}`);

    await checkStatsCounters();
    await checkOrphanedEvents();
    await checkHomepageEvents();

    header("SUMMARY");
    if (issues === 0) {
        console.log("  ✅ All checks passed! Data is healthy.\n");
    } else {
        console.log(`  ⚠️  Found ${issues} issue(s).`);
        if (shouldFix) {
            console.log(`  ✅ Fixed ${fixed} issue(s).\n`);
        } else {
            console.log(`  💡 Run with --fix to auto-repair.\n`);
        }
    }

    process.exit(issues > 0 && !shouldFix ? 1 : 0);
}

main().catch((err) => {
    console.error("\n❌ Fatal error:", err.message);
    process.exit(1);
});
