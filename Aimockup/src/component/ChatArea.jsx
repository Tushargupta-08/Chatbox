import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  Plus,
  Send,
  Trash2,
  Edit3,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Copy,
  RotateCcw,
  Search,
  Sun,
  Moon,
} from "lucide-react";



function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

const Avatar = ({ role }) => (
  <div
    className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5 ${
      role === "assistant"
        ? "bg-emerald-50 text-emerald-700"
        : role === "user"
        ? "bg-sky-50 text-sky-700"
        : "bg-gray-100 text-gray-600"
    }`}
    title={role === "assistant" ? "Assistant" : role === "user" ? "You" : "System"}
  >
    {role === "assistant" ? (
      <Bot size={18} />
    ) : role === "user" ? (
      <User size={18} />
    ) : (
      <span className="text-xs font-medium">SYS</span>
    )}
  </div>
);

const Message = ({ msg, onCopy }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4">
      <div className="relative group grid grid-cols-[36px_1fr] gap-3 sm:gap-4 py-4">
        <div className="pt-1">
          <Avatar role={msg.role} />
        </div>
        <div className="rounded-2xl px-4 py-3 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white dark:bg-zinc-900 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                return (
                  <code
                    className={`${className ?? ""} ${
                      inline
                        ? "px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800"
                        : "block rounded-xl p-3 bg-zinc-900 text-zinc-50 overflow-auto text-sm"
                    }`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              table({ children }) {
                return (
                  <div className="overflow-auto">
                    <table className="min-w-full border-collapse">{children}</table>
                  </div>
                );
              },
              th({ children }) {
                return (
                  <th className="border-b border-zinc-200 dark:border-zinc-800 p-2 text-left bg-zinc-50 dark:bg-zinc-800 font-semibold">
                    {children}
                  </th>
                );
              },
              td({ children }) {
                return (
                  <td className="border-b border-zinc-200 dark:border-zinc-800 p-2 align-top">
                    {children}
                  </td>
                );
              },
            }}
          >
            {msg.content}
          </ReactMarkdown>
          {onCopy && (
            <button
              onClick={() => onCopy(msg.content)}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 top-2 sm:right-2 sm:top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              title="Copy message"
            >
              <Copy size={14} /> Copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TypingDots = () => (
  <div className="w-full max-w-3xl mx-auto px-3 sm:px-4">
    <div className="grid grid-cols-[36px_1fr] gap-3 sm:gap-4 py-4">
      <div className="pt-1">
        <Avatar role="assistant" />
      </div>
      <div className="rounded-2xl px-4 py-3 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white dark:bg-zinc-900">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-bounce [animation-delay:-0.2s]"></span>
          <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-bounce"></span>
          <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-bounce [animation-delay:0.2s]"></span>
        </span>
      </div>
    </div>
  </div>
);

function ChatArea({ conversation, setConversation, isGenerating, onSend, onStop, onRegenerate }) {
  const [input, setInput] = useState("");
  const scrollerRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [conversation.messages, isGenerating]);

  const canSend = input.trim().length > 0 && !isGenerating;

  async function handleSend() {
  const text = input.trim();
  if (!text) return;

  const newMsg = { id: uid(), role: "user", content: text };

  setConversation((c) => {
    const updated = { 
      ...c, 
      messages: [...c.messages, newMsg] 
    };

    // 🟢 If it's a brand new chat, update the title
    if (updated.title === "New Chat" && updated.messages.length === 1) {
      updated.title = text.length > 30 ? text.slice(0, 30) + "…" : text; // shorten long titles
    }

    return updated;
  });

  setInput("");
  await onSend(text);
}


  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSend();
    }
  }

  function copy(text) {
    if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(text);
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h1 className="text-base sm:text-lg font-semibold truncate">ChatBox Ai</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRegenerate}
              disabled={isGenerating || !conversation.messages.some((m) => m.role === "user")}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
              title="Regenerate"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Regenerate</span>
            </button>
            {isGenerating ? (
              <button
                onClick={onStop}
                className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                title="Stop"
              >
                <span className="animate-spin inline-flex"><svg viewBox="0 0 24 24" className="w-4 h-4"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity=".2"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none"/></svg></span>
                Stop
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-3xl">
          {conversation.messages.length === 0 ? (
            <div className="px-6 py-16 text-center text-zinc-500">
              <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 grid place-items-center">
                <Bot />
              </div>
              <h2 className="text-lg font-semibold">Start a new conversation</h2>
              <p className="mt-2 text-sm text-zinc-500">Ask a question or paste some text to discuss.</p>
            </div>
          ) : (
            conversation.messages.map((m) => <Message key={m.id} msg={m} onCopy={copy} />)
          )}

          {isGenerating && <TypingDots />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl p-3 sm:p-4">
       <div className="flex items-end gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 p-2">
  <textarea
    className="flex-1 resize-none rounded-xl p-3 sm:p-4 outline-none placeholder:text-zinc-400 bg-transparent text-zinc-900 dark:text-zinc-50"
    rows={1}
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder="Message…"
  />

  <button
    onClick={handleSend}
    disabled={!canSend}
    className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
    title="Send"
  >
    <Send size={16} /> Send
  </button>
</div>

        </div>
      </div>
    </div>
  );
}


function Sidebar({
  chats,
  activeId,
  onNew,
  onSelect,
  onRename,
  onDelete,
  collapsed,
  setCollapsed,
  theme,
  setTheme,
}) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  // toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={`relative flex flex-col h-full border-r 
        border-zinc-200 dark:border-zinc-800 
        bg-white dark:bg-zinc-950 
        ${collapsed ? "w-[64px]" : "w-[280px]"} transition-all`}
    >
      {/* top bar */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800">
        {collapsed ? (
          <button
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm 
              ring-1 ring-zinc-200 dark:ring-zinc-800 
              bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onNew}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm 
                ring-1 ring-zinc-200 dark:ring-zinc-800 
                bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <Plus size={16} /> New chat
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* theme toggle */}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm 
              ring-1 ring-zinc-200 dark:ring-zinc-800 
              bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 
              transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </>
            )}
          </button>

          {!collapsed && (
            <button
              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm 
                ring-1 ring-zinc-200 dark:ring-zinc-800 
                bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>
      </div>

      {/* search bar */}
      {!collapsed && (
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full px-3 py-2 rounded-lg text-sm bg-zinc-100 dark:bg-zinc-900 
              focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
        </div>
      )}

      {/* chat history */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 mt-4">
            No chats found
          </p>
        ) : (
          filtered.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm
                ${
                  activeId === chat.id
                    ? "bg-zinc-200 dark:bg-zinc-800 font-medium"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              onClick={() => onSelect(chat.id)}
            >
              {editingId === chat.id ? (
                <input
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={() => {
                    onRename(chat.id, tempTitle);
                    setEditingId(null);
                  }}
                  autoFocus
                  className="flex-1 px-2 py-1 bg-transparent outline-none"
                />
              ) : (
                <span className="truncate">{chat.title}</span>
              )}

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(chat.id);
                    setTempTitle(chat.title);
                  }}
                  className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chat.id);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



export default function App() {
  const [theme, setTheme] = useLocalStorage("ui.theme", "light");
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const [chats, setChats] = useLocalStorage("ui.chats", [
    {
      id: uid(),
      title: "ChatBox Ai",
      messages: [
        {
          id: uid(),
          role: "assistant",
          content: "Hi! I\'m your helpful assistant. Ask me anything.",
        },
      ],
    },
  ]);
  const [activeId, setActiveId] = useLocalStorage("ui.activeId", chats[0]?.id);
  const active = chats.find((c) => c.id === activeId) || chats[0];

  const [isGenerating, setIsGenerating] = useState(false);
  const setActiveChat = (updater) => {
    setChats((prev) => prev.map((c) => (c.id === active.id ? updater(c) : c)));
  };

  function newChat() {
    const c = { id: uid(), title: "New Chat", messages: [] };
    setChats((prev) => [c, ...prev]);
    setActiveId(c.id);
  }

  function renameChat(id, title) {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  }

  function deleteChat(id) {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id && chats.length > 1) setActiveId(chats.find((c) => c.id !== id)?.id);
  }

async function onSend(prompt) {
  setIsGenerating(true);

  try {
   //update when you deploy backend
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt, model: "gpt-4o-mini" }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let reply = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.startsWith("data:"));

      for (const line of lines) {
        const token = line.replace("data: ", "");
        if (token === "[DONE]") break;

        reply += token;

        // update UI live
        setActiveChat((c) => ({
          ...c,
          messages: [
            ...c.messages.filter((m) => m.role !== "assistant"),
            { id: "streaming", role: "assistant", content: reply },
          ],
        }));
      }
    }
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    setIsGenerating(false);
  }
}





  function onStop() {

    setIsGenerating(false);
  }

  function onRegenerate() {
    const lastUser = [...active.messages].reverse().find((m) => m.role === "user");
    if (!lastUser || isGenerating) return;
    onSend(lastUser.content);
  }

  const [collapsed, setCollapsed] = useLocalStorage("ui.sidebarCollapsed", false);

  return (
    <div className="h-screen w-full grid grid-cols-[auto_1fr] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Sidebar
        chats={chats}
        activeId={active?.id}
        onNew={newChat}
        onSelect={setActiveId}
        onRename={renameChat}
        onDelete={deleteChat}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        theme={theme}
        setTheme={setTheme}
      />
      <ChatArea
        conversation={active}
        setConversation={(updater) => setActiveChat((c) => (typeof updater === "function" ? updater(c) : updater))}
        isGenerating={isGenerating}
        onSend={onSend}
        onStop={onStop}
        onRegenerate={onRegenerate}
      />
    </div>
  );
}
