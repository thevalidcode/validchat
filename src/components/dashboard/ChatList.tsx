"use client";

import { useStore } from "@/store/useStore";
import {
  Trash2,
  PencilLine,
  Plus,
  Archive,
  ArchiveRestore,
  Clock,
  Check,
  Search,
  MoreHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button";

// ---------- utilities ----------
const isToday = (d: Date) => {
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
};

const isYesterday = (d: Date) => {
  const n = new Date();
  const y = new Date(n);
  y.setDate(n.getDate() - 1);
  return (
    d.getFullYear() === y.getFullYear() &&
    d.getMonth() === y.getMonth() &&
    d.getDate() === y.getDate()
  );
};

const withinDays = (d: Date, days: number) => {
  const n = new Date().getTime();
  return n - d.getTime() <= days * 24 * 60 * 60 * 1000;
};

const humanTime = (t: number) => {
  const d = new Date(t);
  if (isToday(d))
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString();
};

type SortKey = "newest" | "az" | "unread";

// ---------- component ----------
export default function ChatList() {
  const {
    conversations,
    selectedConversationId,
    selectConversation,
    addConversation,
    deleteConversation,
    renameConversation,
    setUnread,
    toggleArchive,
    updateConversationDate,
    updateLastMessageTimestamp,
  } = useStore();

  // local UI state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  // date editor (for testing/demo)
  const [dateEditId, setDateEditId] = useState<string | null>(null);
  const [dateInput, setDateInput] = useState<string>("");

  // compute last activity per conversation (last message timestamp or createdAt)
  const withMeta = useMemo(() => {
    return conversations.map((c) => {
      const lastTs = c.messages.length
        ? c.messages[c.messages.length - 1].timestamp
        : c.createdAt;
      const lastMsg = c.messages.length
        ? c.messages[c.messages.length - 1].text
        : "—";
      return { ...c, lastTs, lastMsg };
    });
  }, [conversations]);

  // filter by search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = withMeta.filter((c) => !c.archived);
    if (!q) return base;
    return base.filter(
      (c) =>
        c.title.toLowerCase().includes(q) || c.lastMsg.toLowerCase().includes(q)
    );
  }, [withMeta, query]);

  // sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "az":
        arr.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "unread":
        arr.sort(
          (a, b) => (b.unread ?? 0) - (a.unread ?? 0) || b.lastTs - a.lastTs
        );
        break;
      case "newest":
      default:
        arr.sort((a, b) => b.lastTs - a.lastTs);
    }
    return arr;
  }, [filtered, sort]);

  // group into sections like WhatsApp
  const sections = useMemo(() => {
    const groups: Record<string, typeof sorted> = {
      Today: [],
      Yesterday: [],
      "Last 7 Days": [],
      Earlier: [],
    };
    sorted.forEach((c) => {
      const d = new Date(c.lastTs);
      if (isToday(d)) groups["Today"].push(c);
      else if (isYesterday(d)) groups["Yesterday"].push(c);
      else if (withinDays(d, 7)) groups["Last 7 Days"].push(c);
      else groups["Earlier"].push(c);
    });
    return groups;
  }, [sorted]);

  // helpers
  const commitRename = (id: string, title: string) => {
    renameConversation(id, title || "Untitled");
    setEditingId(null);
  };

  const openDateEditor = (id: string, ts: number) => {
    setDateEditId(id);
    // datetime-local requires "YYYY-MM-DDTHH:mm"
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, "0");
    const value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setDateInput(value);
  };

  const saveDate = () => {
    if (!dateEditId || !dateInput) return;
    const ts = Date.parse(dateInput);
    // update last message timestamp when present, else createdAt
    const conv = conversations.find((c) => c.id === dateEditId);
    if (!conv) return;
    if (conv.messages.length) updateLastMessageTimestamp(conv.id, ts);
    else updateConversationDate(conv.id, ts);
    setDateEditId(null);
  };

  return (
    <div className="h-full flex flex-col bg-white/5 border-r border-white/10">
      {/* Header: search & controls */}
      <div className="p-3 border-b border-white/10 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/50 absolute left-2 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-[#7c3aed]/30"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg bg-white/10 border border-white/10 px-2 py-2 text-white outline-none"
          title="Sort"
        >
          <option value="newest">Newest</option>
          <option value="az">A–Z</option>
          <option value="unread">Unread first</option>
        </select>
        <Button size="sm" onClick={() => addConversation("New conversation")}>
          <Plus className="w-4 h-4 mr-1" /> New
        </Button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {["Today", "Yesterday", "Last 7 Days", "Earlier"].map((section) => {
          const items = sections[section] || [];
          if (items.length === 0) return null;
          return (
            <div key={section}>
              <div className="sticky top-0 z-10 backdrop-blur bg-black/30 text-white/60 text-xs px-3 py-2 border-b border-white/10">
                {section}
              </div>

              <AnimatePresence initial={false}>
                {items.map((c) => {
                  const active = c.id === selectedConversationId;
                  return (
                    <motion.div
                      key={c.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className={`group px-3 py-3 border-b border-white/5 cursor-pointer ${
                        active ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                      onClick={() => selectConversation(c.id)}
                    >
                      {editingId === c.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            title="Conversation title"
                            className="w-full bg-transparent outline-none border border-white/20 rounded px-2 py-1"
                            value={draftTitle}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                commitRename(c.id, draftTitle);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              commitRename(c.id, draftTitle);
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex md:flex-nowrap flex-wrap items-center gap-3">
                          {/* Avatar bubble (initial) */}
                          <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] grid place-items-center text-white/95 font-semibold">
                            {c.title.slice(0, 1).toUpperCase()}
                          </div>

                          <div className="md:min-w-45 min-w-30 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="truncate text-white/90 text-sm font-medium">
                                {c.title}
                              </div>
                              {c.archived && (
                                <span className="text-[10px] uppercase bg-white/10 px-2 py-0.5 rounded border border-white/10">
                                  Archived
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                              <span className="truncate max-w-[220px] sm:max-w-[340px]">
                                {c.lastMsg || "—"}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs text-white/60">
                              {humanTime(c.lastTs)}
                            </div>
                            {c.unread ? (
                              <div className="mt-1 inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                                {c.unread}
                              </div>
                            ) : (
                              <div className="mt-1 h-5" />
                            )}
                          </div>

                          {/* Quick actions */}
                          <div
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="p-1 rounded hover:bg-white/10"
                              title="Rename"
                              onClick={() => {
                                setEditingId(c.id);
                                setDraftTitle(c.title);
                              }}
                            >
                              <PencilLine className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-white/10"
                              title="Edit date"
                              onClick={() => openDateEditor(c.id, c.lastTs)}
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-white/10"
                              title={c.archived ? "Unarchive" : "Archive"}
                              onClick={() => toggleArchive(c.id)}
                            >
                              {c.archived ? (
                                <ArchiveRestore className="w-4 h-4" />
                              ) : (
                                <Archive className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              className="p-1 rounded hover:bg-white/10"
                              title="Mark as read"
                              onClick={() => setUnread(c.id, 0)}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-white/10"
                              title="More"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-white/10 text-red-300"
                              title="Delete"
                              onClick={() => deleteConversation(c.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Empty */}
        {Object.values(sections).every((arr) => arr.length === 0) && (
          <div className="p-6 text-center text-white/50">
            No conversations found.
          </div>
        )}
      </div>

      {/* Date editor modal (simple, no portal for MVP) */}
      {dateEditId && (
        <div
          className="absolute inset-0 bg-black/50 grid place-items-center p-4"
          onClick={() => setDateEditId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white/10 border border-white/20 backdrop-blur p-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-lg font-semibold">Edit last activity time</div>
            <p className="text-xs text-white/70 mt-1">
              For demo only. Adjusts the last message timestamp (or created date
              if no messages).
            </p>
            <input
              title="Edit date"
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="mt-3 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDateEditId(null)}>
                Cancel
              </Button>
              <Button onClick={saveDate}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
