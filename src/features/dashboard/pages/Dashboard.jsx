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
    { name: "Completed Tasks", value: stats.completed, color: "#00C49F" },
    { name: "Pending Tasks", value: stats.pending, color: "#FF8040" },
    { name: "In Progress Tasks", value: stats.in_progress, color: "#0088FE" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to your dashboard!</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard name="Total Tasks" value={tasks.length} />
        <StatCard name="Completed Tasks" value={stats.completed} />
        <StatCard name="Pending Tasks" value={stats.pending} />
        <StatCard name="In Progress Tasks" value={stats.in_progress} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <OverviewChart data={data} />
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <RecentTaskList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
