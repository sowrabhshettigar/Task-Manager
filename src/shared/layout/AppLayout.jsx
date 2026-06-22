import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 border-r bg-white p-4">
        <nav className="flex flex-col gap-2">
          <Sidebar to="/dashboard" name="Dashboard" />
          <Sidebar to="/task" name="Task" />
          <Sidebar to="/task/create" name="Add Task" />
          <Sidebar to="/calendar" name="Calendar" />
          <Sidebar to="/profile" name="Profile" />
          <Sidebar to="/settings" name="Settings" />
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* <header className="h-10 border-b bg-white shadow-sm flex items-center px-6">
          <Header />
        </header> */}

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
