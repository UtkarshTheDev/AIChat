import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage } from "@/lib/api/gemini";
import { cn } from "@/lib/utils";
import { Shield, User } from "lucide-react";
import { motion } from "motion/react";
import { formatDate } from "@/lib/utils";

interface MessageItemProps {
  message: ChatMessage;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  const timestamp = message.timestamp ? formatDate(message.timestamp) : "";

  return (
    <motion.div
      className={cn(
        "flex gap-3 py-4 px-4",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
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

        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

        {timestamp && (
          <span
            className={cn(
              "text-[10px] mt-2 self-end",
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
