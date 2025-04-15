import React, { useEffect, useRef } from "react";
import { ChatMessage } from "@/lib/api/gemini";
import MessageItem from "./message-item";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Shield, MessageCircle, ChevronDown } from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export default function MessageList({
  messages,
  isLoading = false,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = React.useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if we need to show the scroll down button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!container) return;

      const isScrollable = container.scrollHeight > container.clientHeight;
      const isScrolledUp =
        container.scrollTop <
        container.scrollHeight - container.clientHeight - 100;

      setShowScrollDown(isScrollable && isScrolledUp && messages.length > 0);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 bg-gradient-to-b from-black/0 to-black/20"
    >
      {messages.length === 0 ? (
        <motion.div
          className="h-full flex flex-col items-center justify-center text-white/70 px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md flex flex-col items-center text-center space-y-6">
            <div className="p-3 bg-primary/10 rounded-full backdrop-blur-sm mb-2 border border-primary/20 shadow-lg">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
              Welcome to FilterX
            </h3>
            <div className="space-y-4">
              <p className="text-white/80">
                Start a conversation with our AI assistant. Your message content
                will be automatically filtered for safety.
              </p>
              <div className="grid grid-cols-1 gap-2 pt-4">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 p-3 bg-black/30 text-sm text-white/70 backdrop-blur-sm">
                  <MessageCircle className="h-4 w-4" /> Ask about any topic
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 p-3 bg-black/30 text-sm text-white/70 backdrop-blur-sm">
                  <MessageCircle className="h-4 w-4" /> Upload images for visual
                  analysis
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 p-3 bg-black/30 text-sm text-white/70 backdrop-blur-sm">
                  <MessageCircle className="h-4 w-4" /> Upload PDFs to chat
                  about their content
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="pb-2">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center justify-start p-4 pl-16">
              <div className="flex space-x-1.5">
                <motion.div
                  className="size-2.5 rounded-full bg-primary/80"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="size-2.5 rounded-full bg-primary/80"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.2,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="size-2.5 rounded-full bg-primary/80"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.4,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {showScrollDown && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToBottom}
          className="absolute bottom-20 right-4 bg-primary/80 text-white p-2 rounded-full shadow-lg hover:bg-primary transition-colors"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  );
}
