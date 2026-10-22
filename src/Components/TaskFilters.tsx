import React from "react";

type FilterType = "all" | "active" | "completed" | "drafts";

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTER_OPTIONS = ["all", "active", "completed", "drafts"] as const;

const TaskFilters = React.memo(
  ({ currentFilter, onFilterChange }: TaskFiltersProps) => {
    return (
      <div
        className="flex justify-center gap-2 mb-6 select-none"
        role="tablist"
        aria-label="Filter tasks"
      >
        {FILTER_OPTIONS.map((type) => {
          const isActive = currentFilter === type;
          return (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              role="tab"
              id={`tab-control-${type}`}
              aria-selected={isActive}
              aria-controls="tasks-list-viewport-panel"
              /* 🚀 FIX: dark:bg-indigo-900/50, dark:text-indigo-300, dark:text-slate-400 added */
              className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-all duration-150 transform-gpu cursor-pointer focus:outline-none ${
                isActive
                  ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>
    );
  },
);

TaskFilters.displayName = "TaskFilters";
export default TaskFilters;
