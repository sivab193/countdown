"use client";

import { motion, AnimatePresence } from "framer-motion";

export function Grid({ children, className }) {
    return (
        <motion.div
            layout
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 ${className}`}
        >
            <AnimatePresence mode="popLayout">
                {children}
            </AnimatePresence>
        </motion.div>
    );
}
