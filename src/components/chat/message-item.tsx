import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage } from "@/lib/api/gemini";
import { cn } from "@/lib/utils";
import { Shield, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatDate } from "@/lib/utils";
import { ResponseStream } from "@/components/ui/response-stream";
import ReactMarkdown from "react-markdown";

interface MessageItemProps {
  message: ChatMessage;
}

// Define types for markdown components
interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  const timestamp = message.timestamp ? formatDate(message.timestamp) : "";
  const [streamText, setStreamText] = useState("");
  const [isReadyToRender, setIsReadyToRender] = useState(false);
  const messageRef = React.useRef<HTMLDivElement>(null);

  // After the component mounts, delay showing content slightly for animation purposes
  useEffect(() => {
    // Small delay to allow animations to setup
    const timer = setTimeout(() => {
      setIsReadyToRender(true);

      // Initialize with an empty string for smooth animation start
      if (!isUser) {
        setStreamText("");
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [isUser]);

  // Markdown rendering components
  const markdownComponents = {
    h1: ({ ...props }) => (
      <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-lg font-bold mt-3 mb-2" {...props} />
    ),
    h3: ({ ...props }) => (
      <h3 className="text-base font-bold mt-2 mb-1" {...props} />
    ),
    p: ({ ...props }) => (
      <p className="mb-3 text-sm leading-relaxed" {...props} />
    ),
    ul: ({ ...props }) => (
      <ul className="list-disc pl-5 mb-3 text-sm" {...props} />
    ),
    ol: ({ ...props }) => (
      <ol className="list-decimal pl-5 mb-3 text-sm" {...props} />
    ),
    li: ({ ...props }) => <li className="mb-1 text-sm" {...props} />,
    a: ({ ...props }) => (
      <a className="text-primary underline text-sm" {...props} />
    ),
    code: ({ inline, ...props }: CodeProps) =>
      inline ? (
        <code
          className="bg-black/50 rounded px-1 py-0.5 text-white/90 text-xs"
          {...props}
        />
      ) : (
        <code
          className="block bg-black/70 rounded-md p-3 text-white/90 overflow-x-auto my-3 text-xs"
          {...props}
        />
      ),
    blockquote: ({ ...props }) => (
      <blockquote
        className="border-l-4 border-white/20 pl-4 italic text-white/80 my-3 text-sm"
        {...props}
      />
    ),
    em: ({ ...props }) => (
      <em className="italic text-white/90 text-sm" {...props} />
    ),
    strong: ({ ...props }) => (
      <strong className="font-bold text-white text-sm" {...props} />
    ),
  };

  // Handle streaming updates for markdown display
  const handleStreamUpdate = (text: string) => {
    setStreamText(text);
  };

  // When streaming is complete
  const handleStreamComplete = () => {
    setStreamText(message.content);
  };

  return (
    <motion.div
      className={cn(
        "flex gap-3 py-3 px-5",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 110 }}
    >
      {!isUser && (
        <div className="flex flex-col items-center mt-1">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
          >
            <Avatar className="h-9 w-9 ring-2 ring-white/10 bg-black/40 backdrop-blur-sm shadow-lg">
              <AvatarFallback className="bg-black/40">
                <Shield className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>
      )}

      <motion.div
        ref={messageRef}
        className={cn(
          "px-5 py-3 rounded-xl max-w-[85%] shadow-md flex flex-col relative",
          isUser
            ? "bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60 text-white rounded-tr-none border border-white/10"
            : "bg-black/50 backdrop-blur-sm border border-white/10 text-white rounded-tl-none"
        )}
        initial={{ x: isUser ? 20 : -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
        whileHover={{
          scale: 1.01,
          boxShadow: isUser
            ? "0 0 20px rgba(0, 0, 0, 0.3)"
            : "0 0 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        {isUser && (
          <motion.span
            className="absolute inset-0 rounded-xl rounded-tr-none opacity-30 blur-xl -z-10 bg-primary/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            whileHover={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
          />
        )}

        <AnimatePresence mode="wait">
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed text-sm">
              {message.content}
            </p>
          ) : isReadyToRender ? (
            <div className="prose prose-invert prose-sm max-w-none">
              {!isUser && (
                <div className="relative">
                  {/* Hidden streaming component to capture text */}
                  <div className="absolute opacity-0 pointer-events-none">
                    <ResponseStream
                      textStream={message.content}
                      mode="typewriter"
                      speed={150}
                      onUpdate={handleStreamUpdate}
                      onComplete={handleStreamComplete}
                    />
                  </div>

                  {/* Visible markdown that updates with streamed text */}
                  {streamText.length > 0 && (
                    <motion.div
                      key="markdown-content"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.05 }}
                    >
                      <ReactMarkdown components={markdownComponents}>
                        {streamText}
                      </ReactMarkdown>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </AnimatePresence>

        {timestamp && (
          <span
            className={cn(
              "text-[9px] mt-1 self-end",
              isUser ? "text-white/70" : "text-white/50"
            )}
          >
            {timestamp}
          </span>
        )}
      </motion.div>

      {isUser && (
        <div className="flex flex-col items-center mt-1">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
          >
            <Avatar className="h-9 w-9 ring-2 ring-white/10 bg-black/40 backdrop-blur-sm shadow-lg">
              <AvatarFallback className="bg-black/40">
                <User className="h-5 w-5 text-white" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
