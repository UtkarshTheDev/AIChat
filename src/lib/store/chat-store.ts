import { create } from "zustand";
import { generateId } from "../utils";
import { ChatMessage } from "../api/gemini";

export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  content?: string; // For PDF text content
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  attachedFile: AttachedFile | null;
  error: string | null;

  // Actions
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  clearError: () => void;
  setAttachedFile: (file: AttachedFile | null) => void;
  clearAttachedFile: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isLoading: false,
  attachedFile: null,
  error: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        },
      ],
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearMessages: () => set({ messages: [] }),

  clearError: () => set({ error: null }),

  setAttachedFile: (file) => set({ attachedFile: file }),

  clearAttachedFile: () => set({ attachedFile: null }),
}));
