"use client";

import { create } from "zustand";
import { v4 as uuid } from "uuid";

export type Sender = "agent" | "visitor";

export type Message = {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
  unread?: number;
  archived?: boolean;
};

export type Settings = {
  siteUrl?: string;
  color: string;
  position: "bottom-right" | "bottom-left";
  publicKey: string;
};

export type User = {
  name: string;
  email: string;
};

type State = {
  // auth-ish
  user: User | null;
  setUser: (u: Partial<User>) => void;

  // onboarding + widget
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
  regenerateKey: () => void;

  // chats
  conversations: Conversation[];
  selectedConversationId: string | null;
  selectConversation: (id: string | null) => void;
  addConversation: (title?: string) => string;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  addMessage: (convId: string, sender: Sender, text: string) => void;
  setUnread: (id: string, count: number) => void;
  toggleArchive: (id: string) => void;
  updateConversationDate: (id: string, timestamp: number) => void;
  updateLastMessageTimestamp: (id: string, timestamp: number) => void;
};

const now = () => Date.now();

export const useStore = create<State>((set, get) => ({
  user: { name: "You", email: "you@example.com" },
  setUser: (u) =>
    set((s) => ({ user: { ...(s.user ?? { name: "", email: "" }), ...u } })),

  settings: {
    color: "#7c3aed", // purple-600
    position: "bottom-right",
    publicKey: uuid(),
    siteUrl: "",
  },
  updateSettings: (s) => set((st) => ({ settings: { ...st.settings, ...s } })),
  regenerateKey: () =>
    set({ settings: { ...get().settings, publicKey: uuid() } }),
  setUnread: (id, count) =>
    set((st) => ({
      conversations: st.conversations.map((c) =>
        c.id === id ? { ...c, unread: Math.max(0, Math.floor(count)) } : c
      ),
    })),

  toggleArchive: (id) =>
    set((st) => ({
      conversations: st.conversations.map((c) =>
        c.id === id ? { ...c, archived: !c.archived } : c
      ),
      // if the archived one was selected, unselect it
      selectedConversationId:
        st.selectedConversationId === id ? null : st.selectedConversationId,
    })),

  updateConversationDate: (id, timestamp) =>
    set((st) => ({
      conversations: st.conversations.map((c) =>
        c.id === id ? { ...c, createdAt: timestamp } : c
      ),
    })),

  updateLastMessageTimestamp: (id, timestamp) =>
    set((st) => ({
      conversations: st.conversations.map((c) => {
        if (c.id !== id || c.messages.length === 0) return c;
        const msgs = [...c.messages];
        msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], timestamp };
        return { ...c, messages: msgs };
      }),
    })),

  conversations: [
    {
      id: uuid(),
      title: "Welcome thread",
      createdAt: now(),
      messages: [
        {
          id: uuid(),
          sender: "visitor",
          text: "Hi, is anyone there?",
          timestamp: now() - 60000,
        },
        {
          id: uuid(),
          sender: "agent",
          text: "Hey! How can I help today?",
          timestamp: now() - 30000,
        },
      ],
    },
  ],
  selectedConversationId: null,
  selectConversation: (id) => set({ selectedConversationId: id }),

  addConversation: (title = "New conversation") => {
    const id = uuid();
    set((st) => ({
      conversations: [
        {
          id,
          title,
          createdAt: now(),
          messages: [
            {
              id: uuid(),
              sender: "visitor",
              text: "👋 Hello! I have a quick question.",
              timestamp: now(),
            },
          ],
        },
        ...st.conversations,
      ],
      selectedConversationId: id,
    }));
    return id;
  },

  renameConversation: (id, title) =>
    set((st) => ({
      conversations: st.conversations.map((c) =>
        c.id === id ? { ...c, title } : c
      ),
    })),

  deleteConversation: (id) =>
    set((st) => {
      const list = st.conversations.filter((c) => c.id !== id);
      const selected =
        st.selectedConversationId === id
          ? list[0]?.id ?? null
          : st.selectedConversationId;
      return { conversations: list, selectedConversationId: selected };
    }),

  addMessage: (convId, sender, text) =>
    set((st) => ({
      conversations: st.conversations.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: uuid(), sender, text: text.trim(), timestamp: now() },
              ],
            }
          : c
      ),
    })),
}));
