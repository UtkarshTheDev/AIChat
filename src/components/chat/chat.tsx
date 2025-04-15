import React, { useState, useEffect, useRef } from "react";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import { useChatStore, AttachedFile } from "@/lib/store/chat-store";
import {
  generateChatResponse,
  generateImageResponse,
  ChatMessage,
} from "@/lib/api/gemini";
import { toast } from "sonner";
import { Shield, Sparkles } from "lucide-react";
import { motion } from "motion/react";

// Environment variables should be loaded from .env.local
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export default function Chat() {
  // Use chat store for state management
  const {
    messages,
    isLoading,
    attachedFile,
    error,
    addMessage,
    setLoading,
    setError,
    setAttachedFile,
    clearAttachedFile,
  } = useChatStore();

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Display error toasts when they occur
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle form submission
  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;

    try {
      // Add user message to chat
      addMessage({
        role: "user",
        content: message,
      });

      setLoading(true);

      let response: string;

      // Handle image or text chat based on attached file
      if (attachedFile && attachedFile.type.startsWith("image/")) {
        // If we have an image, use vision model
        response = await generateImageResponse(
          {
            apiKey: GEMINI_API_KEY,
            history: messages,
          },
          message,
          attachedFile.url
        );
      } else if (
        attachedFile &&
        attachedFile.type === "application/pdf" &&
        attachedFile.content
      ) {
        // If we have a PDF, include its content in the prompt
        const pdfPrompt = `The following is the content of a PDF document I'd like you to help me with:\n\n${attachedFile.content}\n\nMy question is: ${message}`;

        response = await generateChatResponse(
          {
            apiKey: GEMINI_API_KEY,
            history: messages,
          },
          pdfPrompt
        );
      } else {
        // Regular text chat
        response = await generateChatResponse(
          {
            apiKey: GEMINI_API_KEY,
            history: messages,
          },
          message
        );
      }

      // Add AI response to chat
      addMessage({
        role: "model",
        content: response,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Handle file uploads
  const handleFileUpload = (file: AttachedFile) => {
    setAttachedFile(file);
  };

  // Handle file removal
  const handleFileRemove = () => {
    clearAttachedFile();
  };

  return (
    <motion.div
      className="w-full max-w-4xl h-[550px] md:h-[650px] rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-gradient-to-b from-black/70 to-black/80 backdrop-blur-md border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.div
        className="p-4 border-b border-white/10 backdrop-blur-sm bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-1.5 rounded-full bg-black/40 border border-white/10"
            >
              <Shield className="h-5 w-5 text-primary" />
            </motion.div>
            <h1 className="text-lg font-medium text-white">FilterX Chat</h1>
          </div>
          <motion.div
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 text-xs text-white/80 border border-white/10"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <Sparkles className="h-3 w-3 text-primary/80" />
            <span>Powered by Gemini</span>
          </motion.div>
        </div>
      </motion.div>

      <MessageList messages={messages} isLoading={isLoading} />
      <div ref={chatEndRef} />

      <ChatInput
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
        onFileRemove={handleFileRemove}
        isLoading={isLoading}
        attachedFile={attachedFile}
      />
    </motion.div>
  );
}
