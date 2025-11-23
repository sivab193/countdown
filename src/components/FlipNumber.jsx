"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function FlipNumber({ value, className, color }) {
    return (
        <div className={cn("relative flex flex-col items-center", className)}>
            <div className="relative overflow-hidden">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: "100%", opacity: 0, rotateX: -90 }}
                        animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                        exit={{ y: "-100%", opacity: 0, rotateX: 90 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className={cn("block tabular-nums origin-center backface-hidden", color)}
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        {value}
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    );
}
