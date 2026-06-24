import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";
import {
  Home,
  ListTodo,
  PlusSquare,
  Calendar,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", name: "Dashboard", icon: Home },
  { to: "/task", name: "Tasks", icon: ListTodo },
  { to: "/task/create", name: "Add Task", icon: PlusSquare },
  { to: "/calendar", name: "Calendar", icon: Calendar },
  { to: "/profile", name: "Profile", icon: User },
  { to: "/settings", name: "Settings", icon: Settings },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          bg-slate-900 text-slate-300
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Task Manager
          </h1>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => (
            <Sidebar
              key={item.to}
              to={item.to}
              name={item.name}
              icon={item.icon}
            />
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 items-center justify-between px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 lg:hidden mr-2"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <Header />
        </header>

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
