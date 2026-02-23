import { PublicProfileClient } from "./client";

export async function generateMetadata({ params }) {
    // Next.js 15+ convention for dynamic route params
    const { slug } = await params;

    return {
        title: `@${slug}'s Countdowns`,
        description: `Check out ${slug}'s public countdowns on ZeroHour`,
        openGraph: {
            title: `@${slug}'s Countdowns`,
            description: `Check out ${slug}'s public countdowns on ZeroHour`,
            images: [`/api/og?title=${encodeURIComponent("Public Profile")}&slug=${encodeURIComponent(slug)}`],
        },
        twitter: {
            card: 'summary_large_image',
            title: `@${slug}'s Countdowns`,
            description: `Check out ${slug}'s public countdowns on ZeroHour`,
            images: [`/api/og?title=${encodeURIComponent("Public Profile")}&slug=${encodeURIComponent(slug)}`],
        },
    }
}

export default async function PublicProfilePage({ params }) {
    // Await params in Next.js 15+ Server Components
    const { slug } = await params;
    return <PublicProfileClient slug={slug} />;
}
