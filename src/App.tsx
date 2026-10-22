import { useState, useEffect, useCallback, useMemo } from "react";
import TaskInput from "./Components/TaskInput";
import TaskFilters from "./Components/TaskFilters";
import TaskItem from "./Components/TaskItem";
import ThemeToggle from "./Components/ThemeToggle";

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  isDraft?: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem("my_tasks");
      if (!savedTasks) return [];
      const parsed = JSON.parse(savedTasks);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "drafts"
  >("all");

  // 🚀 NEW STATE: Custom Popup Modal control karne ke liye
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("my_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((text: string) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: Date.now(), text, completed: false, isDraft: false },
    ]);
  }, []);

  const addDraftTask = useCallback((text: string) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: Date.now(), text, completed: false, isDraft: true },
    ]);
  }, []);

  const toggleComplete = useCallback((id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  }, []);

  const editTask = useCallback((id: number, newText: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === id ? { ...t, text: newText } : t)),
    );
  }, []);

  const publishDraft = useCallback((id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === id ? { ...t, isDraft: false } : t)),
    );
  }, []);

  const convertToDraft = useCallback((id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, isDraft: true, completed: false } : t,
      ),
    );
  }, []);

  // 🚀 FIX: Ab alert ke bajaye popup open hoga
  const openDeletePopup = useCallback(() => {
    setIsDeletePopupOpen(true);
  }, []);

  // Actual mass delete functional logic execution
  const executeDeleteAll = useCallback(() => {
    setTasks((prevTasks) => {
      if (filter === "active")
        return prevTasks.filter((t) => t.completed || t.isDraft);
      if (filter === "completed")
        return prevTasks.filter((t) => !t.completed || t.isDraft);
      if (filter === "drafts") return prevTasks.filter((t) => !t.isDraft);
      return [];
    });
    setIsDeletePopupOpen(false); // Popup close karein execution ke baad
  }, [filter]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "drafts") return task.isDraft;
      if (filter === "active") return !task.completed && !task.isDraft;
      if (filter === "completed") return task.completed && !task.isDraft;
      return true;
    });
  }, [tasks, filter]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300 relative">
      <article className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-6 max-w-md w-full border border-slate-100/40 dark:border-slate-700/50 relative transition-colors duration-300">
        <ThemeToggle />

        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white text-center tracking-tight">
            Task Master
          </h1>
          <p className="sr-only">Organize and manage your tasks efficiently.</p>
        </header>

        <section aria-label="Task Creation Engine">
          <TaskInput onAddTask={addTask} onSaveDraft={addDraftTask} />
        </section>

        <nav aria-label="Dashboard views" className="mb-6">
          <TaskFilters currentFilter={filter} onFilterChange={setFilter} />
        </nav>

        <section
          aria-label="Tasks List Viewport"
          className="space-y-2 max-h-72 overflow-y-auto mb-4 custom-scrollbar"
        >
          {filteredTasks.length === 0 ? (
            <div className="text-center py-6 text-sm font-medium" role="status">
              {filter === "all" ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl mb-1">🚀</span>
                  <p className="text-slate-700 dark:text-slate-200 font-semibold text-base">
                    Your workspace is clean!
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Ready to conquer your day? Type a task above to get started.
                  </p>
                </div>
              ) : filter === "active" ? (
                <div className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
                  <span className="text-xl">🎉</span>
                  <p>All clear! No pending items left.</p>
                </div>
              ) : filter === "completed" ? (
                <div className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
                  <span className="text-xl">🎯</span>
                  <p>Finish your first task to see it here!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
                  <span className="text-xl">📝</span>
                  <p>No temporary drafts saved yet.</p>
                </div>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={toggleComplete}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
                onPublishDraft={publishDraft}
                onConvertToDraft={convertToDraft}
              />
            ))
          )}
        </section>

        {filteredTasks.length > 0 && (
          <footer className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button
              onClick={openDeletePopup} // 👈 Alert ke bajaye modal open hoga
              className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/30 hover:bg-red-100/80 px-3 py-2 rounded-lg transition-all cursor-pointer focus:outline-none"
            >
              🗑️ Delete All {filter !== "all" ? filter : ""}
            </button>
          </footer>
        )}
      </article>

      {/* 🚀 NEW UI LAYOUT: Custom Modern Smooth Confirmation Popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300">
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-100 dark:border-slate-700 text-center scale-in transition-transform duration-300"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center text-xl mx-auto mb-4">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
              Confirm Bulk Action
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to permanently clear all tasks from the{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
                "{filter}"
              </span>{" "}
              view? This process cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsDeletePopupOpen(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteAll}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-white bg-red-500 hover:bg-red-600 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
