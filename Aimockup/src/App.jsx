import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ChatArea from "./component/ChatArea";
import Sidebar from "./component/Sidebar";
import PromptEditor from "./component/PromptEdit";

// Generate unique ID
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// LocalStorage hook
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

export default function App() {
  const [theme, setTheme] = useLocalStorage("ui.theme", "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const [chats, setChats] = useLocalStorage("ui.chats", [
    {
      id: uid(),
      title: "ChatBox Ai",
      messages: [
        {
          id: uid(),
          role: "assistant",
          content: "Hi! I'm your helpful assistant. Ask me anything.",
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useLocalStorage(
    "ui.activeId",
    chats[0]?.id || "0"
  );

  const activeChat = chats.find((c) => c.id === activeId) ?? chats[0];

  const [collapsed, setCollapsed] = useLocalStorage(
    "ui.sidebarCollapsed",
    () => window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  const [isGenerating, setIsGenerating] = useState(false);

  // Update active chat messages safely
  const setActiveChat = (updater) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        const updated = typeof updater === "function" ? updater(c) : updater;
        return {
          ...c,
          messages: c.messages || [],
          ...updated,
        };
      })
    );
  };

  // Start a new chat
  const newChat = () => {
    const c = { id: uid(), title: "New Chat", messages: [] };
    setChats((prev) => [c, ...prev]);
    setActiveId(c.id);
  };

  // Handle sending messages
  const handleSend = async (prompt) => {
    if (!prompt) return;
    setIsGenerating(true);

    const userMsg = { id: uid(), role: "user", content: prompt };
    const tempId = uid();

    setActiveChat((c) => ({
      ...c,
      messages: [
        ...(c.messages || []),
        userMsg,
        { id: tempId, role: "assistant", content: "" },
      ],
    }));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, model: "gpt-4o-mini" }),
      });

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value);

        chunk.split("\n").forEach((line) => {
          if (!line.startsWith("data: ")) return;
          const text = line.replace("data: ", "");
          if (text === "[DONE]") return;

          setActiveChat((c) => ({
            ...c,
            messages: c.messages.map((m) =>
              m.id === tempId ? { ...m, content: m.content + text } : m
            ),
          }));
        });
      }
    } catch (err) {
      console.error(err);
      setActiveChat((c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === tempId ? { ...m, content: "⚠️ Failed to get response." } : m
        ),
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeId={activeChat.id}
        onNew={newChat}
        onSelect={setActiveId}
        onRename={(id, title) =>
          setChats((prev) =>
            prev.map((c) => (c.id === id ? { ...c, title } : c))
          )
        }
        onDelete={(id) => {
          setChats((prev) => {
            const updated = prev.filter((c) => c.id !== id);

            if (activeId === id && updated.length > 0) setActiveId(updated[0].id);
            else if (updated.length === 0) {
              const c = { id: uid(), title: "New Chat", messages: [] };
              setActiveId(c.id);
              return [c];
            }
            return updated;
          });
        }}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        <Routes>
          <Route
            path="/"
            element={
              <ChatArea
                conversation={activeChat}
                setConversation={setActiveChat}
                isGenerating={isGenerating}
                onSend={handleSend}
                onStop={() => setIsGenerating(false)}
                onRegenerate={() => {}}
              />
            }
          />
          <Route
            path="/prompt"
            element={<PromptEditor defaultPrompt="You are a helpful AI." />}
          />
        </Routes>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="absolute top-2 left-2 z-50 md:hidden 
                     flex items-center justify-center w-10 h-10 
                     bg-emerald-500 text-white rounded-full shadow-lg 
                     hover:bg-emerald-600 active:scale-95 
                     transition-transform duration-300"
        >
          <span className="text-xl font-bold">
            {collapsed ? "☰" : "×"}
          </span>
        </button>
      </div>
    </div>
  );
}
