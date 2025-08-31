import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Copy, ChevronDown } from "lucide-react";

export default function ChatArea({
  conversation = { messages: [] },
  setConversation = () => {},
  isGenerating = false,
  onSend = async () => {},
  onStop = () => {},
  onRegenerate = () => {},
}) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [open, setOpen] = useState(false);

  const scrollerRef = useRef(null);
  const bottomRef = useRef(null);

  const models = ["gpt-4o", "gpt-4o-mini", "gpt-5", "gpt-5-mini", "gpt-neo"];

  // Auto scroll
  useEffect(() => {
    if (bottomRef.current) {
      requestAnimationFrame(() => {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [conversation.messages, isGenerating]);

  const canSend = input.trim() && !isGenerating;
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await onSend(text, selectedModel);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSend();
    }
  };

  const copy = (text) => navigator.clipboard.writeText(text);

  return (
    <div className="flex flex-col h-full min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-emerald-400 dark:from-emerald-600 dark:to-green-400 p-3 shadow flex justify-between items-center">
        <h2 className="font-semibold ml-20 text-lg text-white">ChatBox</h2>

        {/* Model Selector */}
        <div className="relative w-40 sm:w-56">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between rounded-md border border-white/30 bg-white/20 px-3 py-1.5 text-sm text-white font-medium shadow-sm hover:bg-white/30 transition"
          >
            <span>{selectedModel}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
          {open && (
            <ul className="absolute mt-2 w-full rounded-md border border-gray-200 bg-white dark:bg-zinc-900 shadow-lg max-h-56 overflow-y-auto z-10">
              {models.map((model) => (
                <li
                  key={model}
                  onClick={() => {
                    setSelectedModel(model);
                    setOpen(false);
                  }}
                  className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 ${
                    selectedModel === model
                      ? "bg-gray-100 dark:bg-zinc-800 font-semibold"
                      : ""
                  }`}
                >
                  {model}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        <AnimatePresence initial={false}>
          {(conversation.messages || []).map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-[75%] break-words px-4 py-2 rounded-2xl shadow-sm ${
                  msg.role === "user"
                    ? "bg-emerald-500 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-zinc-700 text-black dark:text-white rounded-bl-none"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
                {msg.role !== "user" && (
                  <button
                    onClick={() => copy(msg.content)}
                    className="absolute top-1 right-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-zinc-700 px-4 py-2 rounded-2xl animate-pulse text-sm">
                <span className="mr-1">●</span>
                <span className="mr-1">●</span>
                <span>●</span>
              </div>
            </div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-950 flex gap-2">
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="
            flex-1 resize-none rounded-lg 
            border border-zinc-300 dark:border-zinc-700 
            p-2 sm:p-3
            text-sm sm:text-base
            focus:outline-none focus:ring-2 focus:ring-emerald-500
            bg-white dark:bg-zinc-900 
            text-black dark:text-white
          "
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="
            px-3 py-2 sm:px-4 sm:py-2 
            rounded-lg bg-emerald-500 text-white 
            text-sm sm:text-base
            hover:bg-emerald-600 
            disabled:opacity-50
            whitespace-nowrap
          "
        >
          Send
        </button>
      </div>
    </div>
  );
}
