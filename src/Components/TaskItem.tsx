import React, { useState, useRef, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  isDraft?: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number, newText: string) => void;
  onPublishDraft?: (id: number) => void;
  onConvertToDraft?: (id: number) => void;
}

const TaskItem = React.memo(
  ({
    task,
    onToggleComplete,
    onDeleteTask,
    onEditTask,
    onPublishDraft,
    onConvertToDraft,
  }: TaskItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputId = `task-checkbox-${task.id}`;
    const editInputId = `task-edit-input-${task.id}`;

    useEffect(() => {
      if (isEditing) inputRef.current?.focus();
    }, [isEditing]);

    const handleSave = () => {
      if (editText.trim() && editText.trim() !== task.text) {
        onEditTask(task.id, editText.trim());
      }
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditText(task.text);
      setIsEditing(false);
    };

    return (
      /* 🚀 FIX: dark:bg-amber-950/20, dark:bg-green-950/20, dark:bg-slate-800, dark:border-slate-700/60 added */
      <div
        className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 transform-gpu ${
          task.isDraft
            ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-100/80 dark:border-amber-900/40"
            : task.completed
              ? "bg-green-50/60 dark:bg-green-950/20 border-green-100 dark:border-green-900/40 shadow-sm"
              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/30"
        }`}
        role="listitem"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {!isEditing && !task.isDraft && (
            <input
              id={inputId}
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="w-4 h-4 text-emerald-600 border-slate-300 dark:border-slate-600 rounded focus:ring-emerald-500 cursor-pointer shrink-0"
            />
          )}

          {isEditing ? (
            <div className="flex-1">
              <label htmlFor={editInputId} className="sr-only">
                Edit task description text
              </label>
              <input
                id={editInputId}
                ref={inputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoComplete="off"
                spellCheck="false"
                className="w-full px-2 py-0.5 border border-indigo-400 rounded focus:outline-none text-slate-700 dark:text-white bg-white dark:bg-slate-700 text-sm"
              />
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-w-0 text-left">
              {/* 🚀 FIX: dark:text-slate-200 added */}
              <label
                htmlFor={inputId}
                className="text-slate-700 dark:text-slate-200 font-medium cursor-pointer truncate pr-2 select-none"
              >
                {task.text}
              </label>
              {task.completed && (
                <span
                  className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mt-0.5"
                  role="status"
                >
                  ✨ Finished
                </span>
              )}
              {task.isDraft && (
                <span
                  className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mt-0.5"
                  role="status"
                >
                  📝 Draft Mode
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-auto">
          {!isEditing && (
            <>
              {task.isDraft && onPublishDraft && (
                <button
                  onClick={() => onPublishDraft(task.id)}
                  className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors cursor-pointer mr-1"
                >
                  Activate
                </button>
              )}

              {!task.isDraft && !task.completed && onConvertToDraft && (
                <button
                  onClick={() => onConvertToDraft(task.id)}
                  className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-400 font-bold text-xs transition-colors cursor-pointer mr-1"
                >
                  Draft
                </button>
              )}
            </>
          )}

          {/* 🚀 FIX: dark icons modifications */}
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={task.completed}
            className={`p-1.5 rounded-md text-slate-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 ${task.completed ? "opacity-20 cursor-not-allowed" : ""}`}
          >
            {isEditing ? "✓" : "✏️"}
          </button>

          <button
            onClick={() => (isEditing ? handleCancel() : onDeleteTask(task.id))}
            className="text-slate-400 cursor-pointer hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-all p-1.5"
          >
            ✕
          </button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.task.id === nextProps.task.id &&
      prevProps.task.completed === nextProps.task.completed &&
      prevProps.task.text === nextProps.task.text &&
      prevProps.task.isDraft === nextProps.task.isDraft
    );
  },
);

TaskItem.displayName = "TaskItem";
export default TaskItem;
