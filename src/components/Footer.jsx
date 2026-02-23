import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-black/50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-lg font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-emerald-500 mb-2">
                        {siteConfig.title}
                    </span>
                    <p className="text-zinc-500 text-sm">
                        Built with precision and robust timezone support.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
                    <span className="text-zinc-500 text-xs uppercase tracking-widest">Developed by</span>
                    <div className="flex items-center gap-4">
                        <Link
                            href="https://siv19.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-emerald-400 transition-colors font-medium"
                        >
                            siv19.dev
                        </Link>
                        <Link
                            href="https://github.com/sivab193"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-emerald-400 transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link
                            href="https://www.linkedin.com/in/sivab193/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-emerald-400 transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
