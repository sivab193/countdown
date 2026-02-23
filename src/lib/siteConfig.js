/**
 * Centralized site configuration.
 * The title is driven by the NEXT_PUBLIC_SITE_TITLE environment variable,
 * making it easy to change via Vercel dashboard or .env.local without touching code.
 *
 * Usage:
 *   import { siteConfig } from "@/lib/siteConfig";
 *   <h1>{siteConfig.title}</h1>
 */

export const siteConfig = {
    title: process.env.NEXT_PUBLIC_SITE_TITLE || "CtDn",
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Track your important events in any timezone with precision.",
    themeColor: "#10b981", // emerald-500
};
