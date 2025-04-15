import React, { useEffect, useRef } from "react";
import { ChatMessage } from "@/lib/api/gemini";
import MessageItem from "./message-item";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Shield, MessageCircle, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

  // Custom typing indicator component
  const TypingIndicator = () => (
    <motion.div
      className="flex gap-3 py-3 px-4 justify-start w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      key="typing-indicator"
    >
      {/* Bot Avatar */}
      <motion.div
        className="flex-shrink-0 mt-1"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <Avatar className="h-8 w-8 ring-2 ring-white/10 bg-black/40 backdrop-blur-sm shadow-lg">
            <AvatarFallback className="bg-black/40">
              <Shield className="h-4 w-4 text-primary" />
            </AvatarFallback>
          </Avatar>
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      {/* Typing Animation Message Bubble */}
      <motion.div
        className="px-4 py-2.5 rounded-xl max-w-[85%] shadow-md flex items-center bg-black/50 backdrop-blur-sm border border-white/10 text-white rounded-tl-none"
        initial={{ x: -15, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <div className="flex items-center">
          <div className="flex items-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`dot-${i}`}
                className="w-2 h-2 rounded-full bg-white/80"
                animate={{
                  y: ["0%", "-30%", "0%"],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
          <span className="ml-3 text-sm text-white/80 font-medium">
            FilterX is typing...
          </span>
        </div>
      </motion.div>
    </motion.div>
  );

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

          {/* Custom typing indicator with improved animation */}
          <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>

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
