import { useState, useEffect } from "react";
import { getTasks } from "../../tasks/services/tasks.api";
import OverviewChart from "../components/OverviewChart";
import StatCard from "../components/StatCard";
import RecentTaskList from "../components/RecentTaskList";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const stats = tasks.reduce(
    (acc, task) => {
      if (task.status === "completed") acc.completed++;
      if (task.status === "pending") acc.pending++;
      if (task.status === "in_progress") acc.in_progress++;
      return acc;
    },
    {
      completed: 0,
      pending: 0,
      in_progress: 0,
    },
  );

  const data = [
    { name: "Completed", value: stats.completed, color: "#22c55e" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "In Progress", value: stats.in_progress, color: "#3b82f6" },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-slate-600">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back! 🤝</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4">
        <StatCard
          name="Total Tasks"
          value={tasks.length}
          color="text-blue-600"
        />
        <StatCard
          name="Completed"
          value={stats.completed}
          color="text-green-500"
        />
        <StatCard name="Pending" value={stats.pending} color="text-amber-500" />
        <StatCard
          name="In Progress"
          value={stats.in_progress}
          color="text-blue-500"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-4">
            Tasks Overview
          </h2>
          <OverviewChart data={data} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <RecentTaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
