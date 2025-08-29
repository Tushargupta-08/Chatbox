import { useState, useEffect } from "react";
import ChatArea from "./component/ChatArea";

export default function App() {
  // theme state
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // chat state
  const [chats, setChats] = useState([
    { id: Date.now(), title: "New Chat", messages: [] },
  ]);
  const [activeId, setActiveId] = useState(chats[0].id);

  // create new chat
  const handleNew = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveId(newChat.id);
  };

  // select chat
  const handleSelect = (id) => {
    setActiveId(id);
  };

  // rename chat
  const handleRename = (id, newTitle) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, title: newTitle } : chat))
    );
  };

  // delete chat
  const handleDelete = (id) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));

    if (activeId === id) {
      if (chats.length > 1) {
        setActiveId(chats.find((c) => c.id !== id).id);
      } else {
        handleNew(); // ensure at least one chat exists
      }
    }
  };


  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatArea
        chats={chats}
        activeId={activeId}
        onNew={handleNew}
        onSelect={handleSelect}
        onRename={handleRename}
        onDelete={handleDelete}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
