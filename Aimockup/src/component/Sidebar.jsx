import React from "react";
import { Trash2, Sun, Moon, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  chats = [],
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
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`
          flex flex-col h-full bg-white dark:bg-zinc-900 shadow-xl md:shadow-none
          fixed top-0 left-0 z-50 w-64 lg:w-72 transition-transform duration-300
          ${collapsed ? "-translate-x-full" : "translate-x-0"}
          md:relative md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-end p-3 border-b border-zinc-200 dark:border-zinc-800">
          {!collapsed && (
            <h2 className="font-bold text-base sm:text-lg md:text-xl">Chats</h2>
          )}
          {/* Collapse Toggle (optional) */}
          {/* <button
            className="md:hidden p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="w-5 h-5" />
          </button> */}
        </div>

        {/* Edit Prompt button */}
        {!collapsed && (
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => navigate("/prompt")}
              className="w-full px-3 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors font-medium text-sm md:text-base"
            >
              Edit Prompt
            </button>
          </div>
        )}

        {/* New Chat button */}
        {!collapsed && (
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={onNew}
              className="w-full px-3 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors font-medium text-sm md:text-base"
            >
              + New Chat
            </button>
          </div>
        )}

        {/* Chat list */}
        {!collapsed && (
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => {
              const lastMessage =
                chat.messages?.[chat.messages.length - 1]?.content ||
                "No messages yet";

              return (
                <div
                  key={chat.id}
                  className={`
                    flex items-center justify-between p-3 cursor-pointer border-b border-zinc-200 dark:border-zinc-800
                    hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors
                    ${chat.id === activeId ? "bg-emerald-200 dark:bg-emerald-700" : ""}
                  `}
                  onClick={() => onSelect(chat.id)}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-sm md:text-base truncate">
                      {chat.title}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-300 mt-1 line-clamp-2">
                      {lastMessage}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(chat.id);
                    }}
                    className="ml-2 text-zinc-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
