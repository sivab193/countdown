import { siteConfig } from "@/lib/siteConfig";

/**
 * Next.js dynamic manifest route.
 * This replaces the static public/manifest.json so the PWA name
 * is driven by the NEXT_PUBLIC_SITE_TITLE env variable.
 */
export default function manifest() {
    return {
        name: siteConfig.title,
        short_name: siteConfig.title,
        description: siteConfig.description,
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: siteConfig.themeColor,
        icons: [
            {
                src: "/web-app-manifest-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/web-app-manifest-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
