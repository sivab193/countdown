import { Globe, Clock, Smartphone, Share2, Tags, Lock } from "lucide-react";

const features = [
    {
        icon: <Clock className="w-5 h-5 text-emerald-500" />,
        title: "Precision Tracking",
        description: "Count down to (or up from) your most anticipated moments with real-time accuracy.",
        badge: "Live"
    },
    {
        icon: <Globe className="w-5 h-5 text-emerald-500" />,
        title: "Smart Timezones",
        description: "Stop worrying about mental math. Set an event for 'Tokyo Time' and watch it track flawlessly anywhere."
    },
    {
        icon: <Smartphone className="w-5 h-5 text-emerald-500" />,
        title: "Installable PWA",
        description: "Install Countdowns directly to your iOS or Android home screen for quick, native-like access."
    },
    {
        icon: <Share2 className="w-5 h-5 text-emerald-500" />,
        title: "Public Profiles",
        description: "Claim a unique /u/username link to share your public events dynamically over social media."
    },
    {
        icon: <Tags className="w-5 h-5 text-emerald-500" />,
        title: "Event Categories",
        description: "Organize your moments with customizable tags like Birthdays, Vacations, and Movies.",
        badge: "New"
    },
    {
        icon: <Lock className="w-5 h-5 text-emerald-500" />,
        title: "Privacy First",
        description: "Choose exactly which events are public and which are private. Your data, your rules."
    }
];

export function Features() {
    return (
        <section className="w-full bg-zinc-950/80 rounded-3xl border border-white/5 overflow-hidden my-24 py-24 px-8 md:px-16">
            <div className="max-w-4xl mx-auto">

                <div className="text-center mb-20">
                    <p className="text-emerald-500 font-medium text-sm mb-4 tracking-wide uppercase">Features</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Everything you need to<br className="hidden md:block" /> track your important moments
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-start text-left group">
                            <div className="flex items-center gap-3 mb-4">
                                {feature.icon}
                                <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                            </div>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                            {feature.badge && (
                                <span className="mt-4 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-wider font-bold rounded-full border border-emerald-500/20">
                                    {feature.badge}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
