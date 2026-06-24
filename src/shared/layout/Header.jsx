import { Bell } from "lucide-react";

export default function Header() {
  return (
    <div className="flex flex-1 items-center justify-end gap-4">
      <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
        <Bell className="h-5 w-5" />
      </button>
    </div>
  );
}
