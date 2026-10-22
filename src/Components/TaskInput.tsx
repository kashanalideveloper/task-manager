import React, { useState } from "react";

interface TaskInputProps {
  onAddTask: (text: string) => void;
  onSaveDraft: (text: string) => void;
}

const TaskInput = React.memo(({ onAddTask, onSaveDraft }: TaskInputProps) => {
  const [input, setInput] = useState<string>("");
  const isInputEmpty = !input.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInputEmpty) return;
    onAddTask(input);
    setInput("");
  };

  const handleDraftClick = () => {
    if (isInputEmpty) return;
    onSaveDraft(input);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 mb-6"
      aria-label="New Task Creation Form"
    >
      <label htmlFor="task-input-field" className="sr-only">
        Create a new task item
      </label>

      <input
        id="task-input-field"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task..."
        maxLength={100}
        autoComplete="off"
        spellCheck="false"
        /* 🚀 FIX: dark:border-slate-600, dark:text-white, dark:bg-slate-700 classes added */
        className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-white bg-white dark:bg-slate-700 text-sm"
      />

      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={handleDraftClick}
          disabled={isInputEmpty}
          /* 🚀 FIX: dark button variations */
          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-medium px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Draft
        </button>
        <button
          type="submit"
          disabled={isInputEmpty}
          /* 🚀 FIX: disabled dark color configuration */
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </form>
  );
});

TaskInput.displayName = "TaskInput";
export default TaskInput;
