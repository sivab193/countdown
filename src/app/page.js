"use client";

import { useState } from "react";
import { Grid } from "@/components/Grid";
import { CountdownCard } from "@/components/CountdownCard";
import { useEvents } from "@/hooks/useEvents";
import { SecretButton } from "@/components/SecretButton";
import { PasswordModal } from "@/components/PasswordModal";
import { EventModal } from "@/components/EventModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

export default function Home() {
  const { events, addEvent, updateEvent, deleteEvent, isLoaded } = useEvents();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  if (!isLoaded) {
    return null;
  }

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleSave = (eventData) => {
    if (editingEvent) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
    setEditingEvent(null);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="space-y-12 py-12 relative min-h-[80vh]">
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50"
        >
          Countdown
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          Track the moments that matter
        </motion.p>
      </div>

      <Grid>
        {events.map((event) => (
          <CountdownCard
            key={event.id}
            event={event}
            isAdmin={isAdmin}
            onEdit={handleEdit}
          />
        ))}
      </Grid>

      <AnimatePresence>
        {isAdmin && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEventModalOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-40 hover:shadow-xl transition-shadow"
          >
            <Plus className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {!isAdmin && (
        <div className="mt-12 text-center space-y-4 pb-8">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-[10px]">F</span>
              <span>Future Event</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-[10px]">P</span>
              <span>Past Event</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/50 max-w-md mx-auto">
            This is a read-only view. Only administrators can modify event data.
          </p>
          <SecretButton onClick={() => setIsPasswordModalOpen(true)} />
        </div>
      )}

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setIsPasswordModalOpen(false);
        }}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        onSave={handleSave}
        onDelete={deleteEvent}
        event={editingEvent}
      />
    </div>
  );
}
