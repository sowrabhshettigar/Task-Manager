import { Link } from "react-router-dom";

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

function RecentTaskList(props) {
  const recentTasks = [...props.tasks]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 5);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-bold text-slate-800 mb-6">Recent Tasks</h2>

      {recentTasks.length === 0 ? (
        <p className="text-sm text-slate-500">No recent tasks.</p>
      ) : (
        <div className="space-y-4 flex-1">
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-800">{task.title}</p>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyles[task.status] || "bg-slate-100 text-slate-600"}`}
              >
                {statusLabels[task.status] || task.status}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-100">
        <Link
          to="/task"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View all tasks <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

export default RecentTaskList;
