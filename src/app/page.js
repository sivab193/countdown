"use client";

import { useState, useEffect } from "react";
import { Grid } from "@/components/Grid";
import { CountdownCard } from "@/components/CountdownCard";
import { AnimatePresence, motion } from "framer-motion";
import { SecretButton } from "@/components/SecretButton";
import { PasswordModal } from "@/components/PasswordModal";
import { EventModal } from "@/components/EventModal";
import { ProfileModal } from "@/components/ProfileModal";
import { LoginModal } from "@/components/LoginModal";
import { useEvents } from "@/hooks/useEvents";
import { Plus, LogIn, LogOut, User } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");

  const CATEGORIES = ["All", "Birthdays", "Movies", "Work", "Vacations", "Anniversaries", "Other"];

  useEffect(() => {
    if (!auth) {
      console.error("Firebase Auth not initialized");
      setLoadingAuth(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
      // If user is logged in, they are effectively an "admin" of their own data
      if (currentUser) setIsAdmin(true);
      else setIsAdmin(false);
    });
    return () => unsubscribe();
  }, []);

  const { events, addEvent, deleteEvent, updateEvent, loading } = useEvents(user);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  if (loadingAuth) return null; // Or a loading spinner

  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] relative">
      {/* Header / Nav */}
      <div className="absolute top-6 right-8 flex items-center gap-4 z-50">
        {user ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors font-medium border border-foreground/10 px-3 py-1.5 rounded-full hover:bg-foreground/5"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">My Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        )}

        <ThemeToggle />
      </div>

      <main className="max-w-7xl mx-auto pt-12 px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
            Countdowns
          </h1>

          {/* Only show Add button if logged in */}
          {user && (
            <button
              onClick={handleAddEvent}
              className="p-3 rounded-full bg-foreground text-background hover:scale-110 transition-transform shadow-lg shrink-0"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>

        {events.length > 0 && (
          <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <Grid>
          <AnimatePresence mode="popLayout">
            {events
              .filter(e => filterCategory === "All" || (e.category || "Other") === filterCategory)
              .map((event) => (
                <CountdownCard
                  key={event.id}
                  event={event}
                  onDelete={deleteEvent}
                  onEdit={handleEditEvent}
                  isAdmin={!!user} // Only allow edits if logged in
                />
              ))}
          </AnimatePresence>
        </Grid>
      </main>

      <div className="mt-12 text-center space-y-4 pb-8">
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-[10px]">P</span>
            <span>Past Event</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-[10px]">F</span>
            <span>Future Event</span>
          </div>
        </div>

        {user ? (
          <p className="text-xs text-muted-foreground/80 max-w-md mx-auto pt-4 border-t border-border/50">
            Tip: Click "My Profile" to claim your unique link (e.g., /u/yourname) and share your public countdowns with the world!
          </p>
        ) : (
          <p className="text-xs text-muted-foreground/50 max-w-md mx-auto">
            Log in to create and manage your own events.
          </p>
        )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={deleteEvent}
        event={editingEvent}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
      />
    </div>
  );
}
