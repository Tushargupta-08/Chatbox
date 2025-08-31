import { useState } from "react";
import { Save, Edit3, Trash2, Plus } from "lucide-react";

export default function PromptManager() {
  const [prompts, setPrompts] = useState([
    { id: Date.now(), text: "Default system prompt", editing: false },
  ]);

  const handleSave = (id, newText) => {
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, text: newText, editing: false } : p
      )
    );
  };

  const handleDelete = (id) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAdd = () => {
    setPrompts((prev) => [
      ...prev,
      { id: Date.now(), text: "", editing: true },
    ]);
  };

  return (
    <div className="w-full sm:w-3/4 mx-auto mt-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-base ml-20 sm:text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Prompt Settings
        </h2>
        <button
          onClick={handleAdd}
          className="cursor-pointer mr-3 flex items-center gap-1 px-3 py-1 text-xs sm:text-sm rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> Add Prompt
        </button>
      </div>

      {/* Prompt List */}
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="p-3 sm:p-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Prompt #{prompt.id.toString().slice(-4)}
            </span>
            <div className="flex gap-2">
              {prompt.editing ? (
                <button
                  onClick={() => handleSave(prompt.id, prompt.text)}
                  className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" /> Save
                </button>
              ) : (
                <button
                  onClick={() =>
                    setPrompts((prev) =>
                      prev.map((p) =>
                        p.id === prompt.id ? { ...p, editing: true } : p
                      )
                    )
                  }
                  className=" cursor-pointer flex items-center gap-1 px-2 py-1 text-xs sm:text-sm rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition"
                >
                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" /> Edit
                </button>
              )}

              <button
                onClick={() => handleDelete(prompt.id)}
                className=" cursor-pointer flex items-center gap-1 px-2 py-1 text-xs sm:text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Delete
              </button>
            </div>
          </div>

          {prompt.editing ? (
            <textarea
              value={prompt.text}
              onChange={(e) =>
                setPrompts((prev) =>
                  prev.map((p) =>
                    p.id === prompt.id ? { ...p, text: e.target.value } : p
                  )
                )
              }
              rows={3}
              placeholder="Type your system prompt here..."
              className="w-full resize-none rounded-md border border-zinc-300 dark:border-zinc-700 p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          ) : (
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
              {prompt.text || "No prompt set yet."}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
