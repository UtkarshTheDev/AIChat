import React, { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Smile, X } from "lucide-react";
import { AttachedFile } from "@/lib/store/chat-store";
import FileUpload from "./file-upload";
import { motion, AnimatePresence } from "motion/react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onFileUpload: (file: AttachedFile) => void;
  onFileRemove: () => void;
  isLoading?: boolean;
  attachedFile: AttachedFile | null;
}

export default function ChatInput({
  onSubmit,
  onFileUpload,
  onFileRemove,
  isLoading = false,
  attachedFile,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSubmit(trimmedMessage);
      setMessage("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      // Scroll to bottom after sending message
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <motion.div
      className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <AnimatePresence>
        {showFileUpload && !attachedFile && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FileUpload
              onFileUpload={(file) => {
                onFileUpload(file);
                setShowFileUpload(false);
              }}
              onFileRemove={onFileRemove}
              currentFile={attachedFile}
            />
          </motion.div>
        )}

        {attachedFile && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <FileUpload
              onFileUpload={onFileUpload}
              onFileRemove={onFileRemove}
              currentFile={attachedFile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`flex-shrink-0 rounded-full bg-gradient-to-br ${
              showFileUpload
                ? "from-white/10 to-white/20 text-white border-white/20"
                : "from-black/40 to-black/50 text-white/80 border-white/10"
            } hover:from-white/10 hover:to-white/20 hover:text-white border hover:border-white/20 shadow-lg`}
            onClick={() => setShowFileUpload(!showFileUpload)}
            disabled={isLoading}
            aria-label={showFileUpload ? "Close file upload" : "Attach file"}
          >
            {showFileUpload ? (
              <X className="h-8 w-8" />
            ) : (
              <Paperclip className="h-8 w-8" />
            )}
          </Button>
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/10 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: showFileUpload ? 0.3 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        <motion.div
          className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm focus-within:border-white/30 transition-all duration-200 shadow-lg"
          animate={{
            boxShadow: message.trim()
              ? "0 0 0 1px rgba(255, 255, 255, 0.2), 0 4px 10px rgba(0, 0, 0, 0.3)"
              : "none",
          }}
          transition={{ duration: 0.3 }}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[50px] max-h-[200px] w-full resize-none bg-transparent px-4 py-3 text-white placeholder:text-white/40 outline-none"
            disabled={isLoading}
            rows={1}
          />
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/70 via-white/40 to-primary/70"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: message.trim() ? 1 : 0,
              opacity: message.trim() ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
          <Button
            type="button"
            size="icon"
            className={`flex-shrink-0 rounded-full shadow-lg transition-all duration-200 ${
              message.trim() && !isLoading
                ? "bg-gradient-to-br from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60 border border-white/10"
                : "bg-black/60 text-white/40 border border-white/10"
            }`}
            onClick={handleSubmit}
            disabled={isLoading || !message.trim()}
          >
            <Send className="h-8 w-8" />
            <motion.span
              className="absolute inset-0 rounded-full bg-primary/20 opacity-0"
              animate={{
                scale: isLoading ? [1, 1.2, 1] : 1,
                opacity: isLoading ? [0.2, 0.5, 0.2] : 0,
              }}
              transition={{
                duration: 1.5,
                repeat: isLoading ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
