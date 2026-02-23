import { Globe, Clock, Smartphone, Share2, Tags, Lock } from "lucide-react";

const features = [
    {
        icon: <Clock className="w-5 h-5 text-emerald-500" />,
        title: "Precision Tracking",
        description: "Count down to (or up from) your most anticipated moments with real-time accuracy."
    },
    {
        icon: <Globe className="w-5 h-5 text-emerald-500" />,
        title: "Smart Timezones",
        description: "Stop worrying about mental math. Set an event for 'Tokyo Time' and watch it track flawlessly anywhere."
    },
    {
        icon: <Smartphone className="w-5 h-5 text-emerald-500" />,
        title: "Installable PWA",
        description: "Install ZeroHour directly to your iOS or Android home screen for quick, native-like access."
    },
    {
        icon: <Share2 className="w-5 h-5 text-emerald-500" />,
        title: "Public Profiles",
        description: "Claim a unique /u/username link to share your public events dynamically over social media."
    },
    {
        icon: <Tags className="w-5 h-5 text-emerald-500" />,
        title: "Event Categories",
        description: "Organize your moments with customizable tags like Birthdays, Vacations, and Movies."
    },
    {
        icon: <Lock className="w-5 h-5 text-emerald-500" />,
        title: "Privacy First",
        description: "Choose exactly which events are public and which are private. Your data, your rules."
    }
];

export function Features() {
    return (
        <section className="w-full bg-zinc-950/80 sm:rounded-3xl border-y sm:border border-white/5 py-4 lg:py-6 px-4 md:px-12 lg:px-8 mx-[-1rem] sm:mx-0 w-[calc(100%+2rem)] sm:w-full max-w-none shrink-0">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col gap-3 sm:gap-4 pb-2 pt-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-6 sm:pb-0 sm:pt-0">
                    {features.map((feature, idx) => (
                        <div key={idx} className="w-full shrink-0 flex flex-col justify-center items-start text-left group bg-white/[0.02] sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-white/5 sm:border-transparent">
                            <div className="flex items-center gap-3 mb-0 sm:mb-2 lg:mb-1 w-full">
                                <div className="shrink-0">{feature.icon}</div>
                                <h3 className="text-white font-semibold text-[17px] sm:text-base lg:text-sm whitespace-nowrap overflow-hidden text-ellipsis">{feature.title}</h3>
                            </div>
                            <p className="hidden sm:block text-zinc-500 leading-relaxed text-sm lg:text-[13px]">
                                {feature.description}
                            </p>
                            {feature.badge && (
                                <span className="hidden sm:inline-block mt-4 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-wider font-bold rounded-full border border-emerald-500/20">
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
