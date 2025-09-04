"use client";

import ChatList from "@/components/dashboard/ChatList";
import ChatWindow from "@/components/dashboard/ChatWindow";

export default function ChatsPage() {
  return (
    <div className="h-[calc(100vh-160px)] overflow-y-auto grid grid-cols-1 md:grid-cols-[320px_1fr]">
      <ChatList />
      <ChatWindow />
    </div>
  );
}
