"use client";

import { Toaster } from "sonner";
import dynamic from "next/dynamic";
import {
  Bot,
  Github,
  Shield,
  ShieldCheck,
  Twitter,
  Linkedin,
  Heart,
} from "lucide-react";
import { Spotlight, GridBackground } from "@/components/blocks/spotlight-new";
import { motion } from "motion/react";

// Dynamically import Chat component to handle client-side dependencies
const DynamicChat = dynamic(() => import("@/components/chat/chat"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[70vh] w-full">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <ShieldCheck className="h-12 w-12 text-primary" />
        <p className="text-lg text-white/80 font-medium">
          Initializing FilterX...
        </p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black/95 antialiased bg-grid-white/[0.02] relative overflow-hidden flex flex-col">
      <GridBackground />
      <Spotlight />

      {/* Header - Fixed at the top */}
      <motion.header
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/50 border-b border-white/10 py-4 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl backdrop-blur-sm border border-white/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-white">FilterX</span>
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-white/10">
                  AI Chat
                </span>
              </h1>
              <p className="text-xs text-white/60">
                AI-powered content protection
              </p>
            </div>
          </div>

          <a
            href="https://github.com/UtkarshTheDev/filterx"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-white/60 hover:text-white/90 hover:bg-white/5 transition-all rounded-full"
          >
            <Github className="h-6 w-6" />
          </a>
        </div>
      </motion.header>

      {/* Main content area - takes remaining space and centers chat */}
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4 relative z-10 mt-4">
        <motion.div
          className="w-full max-w-5xl flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <DynamicChat />
        </motion.div>
      </main>

      {/* Enhanced Footer */}
      <motion.footer
        className="w-full bg-black/30 backdrop-blur-md border-t border-white/10 py-6 px-4 relative z-10 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-white">FilterX</span>
            </div>

            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-1 text-xs text-white/40">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-secondary" />
                <span>
                  by{" "}
                  <a
                    href="https://github.com/UtkarshTheDev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-white transition-colors"
                  >
                    UtkarshTheDev
                  </a>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/UtkarshTheDev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-full transition-all border border-white/10"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/UtkarshTheDev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-full transition-all border border-white/10"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/utkarshthedev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-full transition-all border border-white/10"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Toaster - Move outside of content div */}
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: { toast: "!bg-neutral-900 !text-white" },
        }}
      />
    </div>
  );
}
