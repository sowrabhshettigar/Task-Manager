import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask } from "../services/tasks.api";
import {
  Pencil,
  Trash2,
  Search,
  Plus,
  Eye,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ListTodo,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
} from "lucide-react";

const statusConfig = {
  completed: {
    label: "Completed",
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200/70 shadow-sm",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/70 shadow-sm",
    dotClass: "bg-amber-500",
    icon: Clock,
  },
  in_progress: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/70 shadow-sm",
    dotClass: "bg-blue-500 animate-pulse",
    icon: Sparkles,
  },
};

function TaskList() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("status");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      setOpenDropdownId(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const statusPriority = { in_progress: 1, pending: 2, completed: 3 };
  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "in_progress",
  ).length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const filteredTasks = tasks
    .filter((task) => tab === "all" || task.status === tab)
    .filter((task) => {
      const matchTitle = task.title
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchDesc = task.description
        ?.toLowerCase()
        .includes(search.toLowerCase());
      return matchTitle || matchDesc;
    });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "status") {
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status];
      }
      const dateA = a.dueDate
        ? new Date(a.dueDate).getTime()
        : 8640000000000000;
      const dateB = b.dueDate
        ? new Date(b.dueDate).getTime()
        : 8640000000000000;
      return dateA - dateB;
    }
    if (sortBy === "dueDateAsc") {
      const dateA = a.dueDate
        ? new Date(a.dueDate).getTime()
        : 8640000000000000;
      const dateB = b.dueDate
        ? new Date(b.dueDate).getTime()
        : 8640000000000000;
      return dateA - dateB;
    }
    if (sortBy === "dueDateDesc") {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return dateB - dateA;
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === "completed") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    return due < today;
  };

  const getTabClass = (tabName) => {
    const isActive = tab === tabName;
    return `relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
    }`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Header Loading Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-slate-100 rounded mt-2 animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-blue-200/60 rounded-xl animate-pulse" />
        </div>

        {/* Overview Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-slate-200/70 bg-white shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-9 w-9 bg-slate-100 rounded-lg animate-pulse" />
              </div>
              <div className="h-8 w-12 bg-slate-200 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>

        {/* Main Table Container Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          {/* Controls Bar Skeleton */}
          <div className="p-4 border-b border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-20 bg-slate-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="h-9 w-full md:w-64 bg-slate-100 rounded-xl animate-pulse" />
              <div className="h-9 w-32 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Table Loading State */}
          <div className="p-4 bg-blue-50/40 text-blue-600 text-xs font-semibold flex items-center justify-center gap-2 border-b border-slate-100">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Loading tasks...
          </div>

          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="px-5 py-3 flex items-center justify-between gap-4 animate-pulse"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-2/5 bg-slate-200 rounded" />
                  <div className="h-3 w-3/5 bg-slate-100 rounded" />
                </div>
                <div className="h-6 w-24 bg-slate-100 rounded-full" />
                <div className="h-4 w-28 bg-slate-100 rounded" />
                <div className="h-8 w-8 bg-slate-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-red-200 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">
          Error Loading Tasks
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Something went wrong while fetching your tasks. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-3.5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-blue-600" />
            Task Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, track, and organize your tasks efficiently
          </p>
        </div>

        <button
          onClick={() => navigate("/task/create")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 hover:shadow-md transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Card */}
        <div
          onClick={() => setTab("all")}
          className={`p-3.5 rounded-xl border bg-white shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${
            tab === "all"
              ? "ring-2 ring-blue-600 border-transparent"
              : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Tasks
            </span>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {totalCount}
            </span>
          </div>
        </div>

        {/* Pending Card */}
        <div
          onClick={() => setTab("pending")}
          className={`p-3.5 rounded-xl border bg-white shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${
            tab === "pending"
              ? "ring-2 ring-amber-500 border-transparent"
              : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              Pending
            </span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {pendingCount}
            </span>
          </div>
        </div>

        {/* In Progress Card */}
        <div
          onClick={() => setTab("in_progress")}
          className={`p-3.5 rounded-xl border bg-white shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${
            tab === "in_progress"
              ? "ring-2 ring-blue-500 border-transparent"
              : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              In Progress
            </span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {inProgressCount}
            </span>
          </div>
        </div>

        {/* Completed Card */}
        <div
          onClick={() => setTab("completed")}
          className={`p-3.5 rounded-xl border bg-white shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${
            tab === "completed"
              ? "ring-2 ring-emerald-500 border-transparent"
              : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Completed
            </span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {completedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-visible">
        {/* Controls Bar: Tabs, Search & Sort */}
        <div className="p-3 border-b border-slate-200/80 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50">
              <button
                className={getTabClass("all")}
                onClick={() => setTab("all")}
              >
                All
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    tab === "all"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {totalCount}
                </span>
              </button>

              <button
                className={getTabClass("pending")}
                onClick={() => setTab("pending")}
              >
                Pending
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    tab === "pending"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {pendingCount}
                </span>
              </button>

              <button
                className={getTabClass("in_progress")}
                onClick={() => setTab("in_progress")}
              >
                In Progress
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    tab === "in_progress"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {inProgressCount}
                </span>
              </button>

              <button
                className={getTabClass("completed")}
                onClick={() => setTab("completed")}
              >
                Completed
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    tab === "completed"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {completedCount}
                </span>
              </button>
            </div>

            {/* Search and Sort Inputs */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 md:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  placeholder="Search tasks..."
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="relative flex items-center">
                <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="status">Sort: Status</option>
                  <option value="dueDateAsc">Due: Earliest First</option>
                  <option value="dueDateDesc">Due: Latest First</option>
                  <option value="title">Title: A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Task Table Wrapper (Dynamic height to pull pagination up when few rows) */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5 rounded-tl-2xl">Task Info</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Due Date</th>
                {(tab === "all" || tab === "completed") && (
                  <th className="px-4 py-2.5">Completed On</th>
                )}
                <th className="px-4 py-2.5 text-right rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" ref={dropdownRef}>
              {sortedTasks.map((task, index) => {
                const config =
                  statusConfig[task.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                const overdue = isOverdue(task.dueDate, task.status);

                const isNearBottom =
                  sortedTasks.length > 1 &&
                  index >= Math.max(1, sortedTasks.length - 2);

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/80 transition-colors duration-150 group"
                  >
                    <td className="px-4 py-2">
                      <div
                        className="cursor-pointer group-hover:text-blue-600 transition-colors"
                        onClick={() => navigate(`/task/${task.id}`)}
                      >
                        <h3 className="font-semibold text-slate-800 text-xs leading-snug">
                          {task.title}
                        </h3>
                      </div>
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.badgeClass}`}
                      >
                        {config.label}
                      </span>
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span
                          className={`text-xs font-medium ${
                            overdue
                              ? "text-rose-600 font-bold"
                              : "text-slate-600"
                          }`}
                        >
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "No due date"}
                        </span>
                        {overdue && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-rose-100 text-rose-700 rounded">
                            Overdue
                          </span>
                        )}
                      </div>
                    </td>

                    {(tab === "all" || tab === "completed") && (
                      <td className="px-4 py-2 whitespace-nowrap text-slate-600 font-medium">
                        {task.status === "completed" && task.completedAt ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {new Date(task.completedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                    )}

                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(
                              openDropdownId === task.id ? null : task.id,
                            );
                          }}
                          className={`inline-flex items-center justify-center h-7.5 w-7.5 rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-150 hover:bg-slate-100 hover:text-slate-900 focus:outline-none ${
                            openDropdownId === task.id
                              ? "bg-slate-100 ring-2 ring-blue-500/20 border-blue-400 text-blue-600"
                              : ""
                          }`}
                          aria-label="Actions"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>

                        {openDropdownId === task.id && (
                          <div
                            className={`absolute right-0 z-50 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl transition-all duration-150 animate-fade-in ${
                              isNearBottom
                                ? "bottom-full mb-2"
                                : "top-full mt-2"
                            }`}
                          >
                            <button
                              onClick={() => {
                                setOpenDropdownId(null);
                                navigate(`/task/${task.id}`);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <Eye className="h-4 w-4 text-blue-500" />
                              View Details
                            </button>

                            <button
                              onClick={() => {
                                setOpenDropdownId(null);
                                navigate(`/task/edit/${task.id}`);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors"
                            >
                              <Pencil className="h-4 w-4 text-amber-500" />
                              Edit Task
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              onClick={() => handleDelete(task.id)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-rose-500" />
                              Delete Task
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {sortedTasks.length === 0 && (
                <tr>
                  <td
                    colSpan={tab === "all" || tab === "completed" ? 5 : 4}
                    className="px-6 py-12 text-center"
                  >
                    <div className="max-w-xs mx-auto flex flex-col items-center">
                      <div className="p-3 bg-blue-50 rounded-full text-blue-500 mb-2">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">
                        No tasks found
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {search
                          ? `No tasks matching "${search}". Try clearing search.`
                          : "There are no tasks available in this section."}
                      </p>
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 transition"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-2.5 px-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold text-slate-500 bg-slate-50/50 rounded-b-2xl">
          <p>
            Showing <span className="text-slate-800">{sortedTasks.length}</span>{" "}
            of <span className="text-slate-800">{tasks.length}</span> total
            tasks
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="p-1 border border-slate-200 rounded-lg text-slate-400 bg-slate-100 cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="px-2.5 py-1 border border-blue-600 rounded-lg bg-blue-600 text-white font-bold shadow-sm text-xs">
              1
            </button>
            <button
              disabled
              className="p-1 border border-slate-200 rounded-lg text-slate-400 bg-slate-100 cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskList;
