"use client";

import { useStore } from "@/store/useStore";
import { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Paperclip, Smile, ArrowDown } from "lucide-react";
import Button from "@/components/ui/button";

export default function ChatWindow() {
  const { conversations, selectedConversationId, addMessage } = useStore();
  const [text, setText] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const conv = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  // Scroll handling
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      setShowScrollBtn(el.scrollTop + el.clientHeight < el.scrollHeight - 100);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const send = (sender: "agent" | "visitor") => {
    if (!conv || !text.trim()) return;
    addMessage(conv.id, sender, text);
    setText("");
    scrollToBottom();

    // Fake typing indicator for visitor simulation
    if (sender === "agent") {
      setTyping(true);
      setTimeout(() => {
        addMessage(conv.id, "visitor", "Got it! 👍");
        setTyping(false);
        scrollToBottom();
      }, 1500);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#020617] to-[#041021] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="text-white/80 font-medium">
          {conv ? conv.title : "Select or create a conversation"}
        </div>
        {conv && <div className="text-xs text-white/50">Chatting as Agent</div>}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {conv?.messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-end gap-2 ${
              m.sender === "agent" ? "justify-end" : "justify-start"
            }`}
          >
            {m.sender === "visitor" && (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs text-white/70">
                V
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-md ${
                m.sender === "agent"
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white rounded-br-none"
                  : "bg-white/10 text-white rounded-bl-none"
              }`}
            >
              <div>{m.text}</div>
              <div className="text-xs opacity-70 mt-1 text-right">
                {new Date(m.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-white/60"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs">
              V
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-300"></span>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Scroll-to-bottom */}
      {showScrollBtn && (
        <button
          title="Scroll to bottom"
          onClick={scrollToBottom}
          className="absolute bottom-20 right-6 p-2 rounded-full bg-white/10 text-white shadow hover:bg-white/20"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        {conv ? (
          <div className="flex md:flex-nowrap flex-wrap items-center gap-2">
            <button
              title="Emoji"
              className="p-2 rounded-lg hover:bg-white/10 text-white/70"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              title="Files"
              className="p-2 rounded-lg hover:bg-white/10 text-white/70"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send("agent")}
              placeholder="Type a message…"
              className="flex-1 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-[#7c3aed]/30"
            />
            <Button onClick={() => send("agent")}>Send</Button>
          </div>
        ) : (
          <div className="text-white/60 text-sm">No conversation selected.</div>
        )}
      </div>
    </div>
  );
}
