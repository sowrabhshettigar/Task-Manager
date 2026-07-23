import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, deleteTask } from "../services/tasks.api";
import { ArrowLeft } from "lucide-react";

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

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTaskById(id);
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      navigate("/task");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
  if (!task) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <button
          onClick={() => navigate("/task")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </button>

        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyles[task.status] || "bg-slate-100 text-slate-600"}`}>
            {statusLabels[task.status] || task.status}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-2">Description</h3>
          <p className="text-sm text-slate-600">{task.description || "No description provided."}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-2">Due Date</h3>
          <p className="text-sm text-slate-600">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-2">Created At</h3>
          <p className="text-sm text-slate-600">{task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-2">Completed At</h3>
          <p className="text-sm text-slate-600">{task.completedAt ? new Date(task.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}</p>
        </div>
      </div>

      <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
        <button
          onClick={() => navigate(`/task/edit/${id}`)}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit Task
        </button>
        <button
          onClick={handleDelete}
          className="px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
        >
          Delete Task
        </button>
      </div>
    </div>
  );
}
export default TaskDetails;
