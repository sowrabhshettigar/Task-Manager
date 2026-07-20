import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask } from "../services/tasks.api";
import { Pencil, Trash2, Search, Filter, Plus } from "lucide-react";

const statusStyles = {
  completed: "bg-green-100 text-green-600",
  pending: "bg-amber-100 text-amber-600",
  in_progress: "bg-blue-100 text-blue-600",
};

const statusLabels = {
  completed: "Completed",
  pending: "Pending",
  in_progress: "In Progress",
};

function TaskList() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const statusPriority = { in_progress: 1, pending: 2, completed: 3 };
  const sortedTasks = [...tasks].sort((a, b) => {
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 8640000000000000;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 8640000000000000;
    return dateA - dateB;
  });

  const filteredTasks = sortedTasks
    .filter((task) => tab === "all" || task.status === tab)
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));

  const getTabClass = (tabName) =>
    `text-sm font-semibold pb-2 transition-colors ${
      tab === tabName
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-slate-500 hover:text-slate-800"
    }`;

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">Loading tasks...</div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">Error loading tasks.</div>
    );

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-slate-900">All Tasks</h1>

          <button
            onClick={() => navigate("/task/create")}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
        <div className="flex items-center gap-6 mt-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                placeholder="Search tasks..."
                onChange={handleChange}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
          </div>

          <button className={getTabClass("all")} onClick={() => setTab("all")}>
            All ({tasks.length})
          </button>

          <button
            className={getTabClass("pending")}
            onClick={() => setTab("pending")}
          >
            Pending ({tasks.filter((t) => t.status === "pending").length})
          </button>

          <button
            className={getTabClass("in_progress")}
            onClick={() => setTab("in_progress")}
          >
            In Progress (
            {tasks.filter((t) => t.status === "in_progress").length})
          </button>

          <button
            className={getTabClass("completed")}
            onClick={() => setTab("completed")}
          >
            Completed ({tasks.filter((t) => t.status === "completed").length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="w-[30%] px-6 py-3 font-semibold">Task</th>
              <th className="w-[20%] px-6 py-3 font-semibold">Status</th>
              <th className="w-[20%] px-6 py-3 font-semibold">Due Date</th>
              {(tab === "all" || tab === "completed") && (
                <th className="w-[20%] px-6 py-3 font-semibold">
                  Completed On
                </th>
              )}
              <th className="w-[10%] px-6 py-3 font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50/50">
                <td
                  className="px-6 py-4 font-medium text-slate-800 cursor-pointer"
                  onClick={() => navigate(`/task/${task.id}`)}
                >
                  {task.title}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyles[task.status]}`}
                  >
                    {statusLabels[task.status] || task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                {(tab === "all" || tab === "completed") && (
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {task.status === "completed"
                      ? new Date(task.completedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => navigate(`/task/edit/${task.id}`)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
        <p>
          Showing 1 to {tasks.length} of {tasks.length} tasks
        </p>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1 border border-slate-200 rounded text-slate-600 bg-slate-50">
            &lt;
          </button>
          <button className="px-3 py-1 border border-blue-600 rounded bg-blue-600 text-white">
            1
          </button>
          <button className="px-3 py-1 border border-slate-200 rounded text-slate-600">
            2
          </button>
          <button className="px-3 py-1 border border-slate-200 rounded text-slate-600">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskList;
