import { NavLink } from "react-router-dom";

export default function Sidebar(props) {
  const Icon = props.icon;

  return (
    <NavLink
      to={props.to}
      end
      className={({ isActive }) =>
        `
        group flex items-center gap-3
        px-3 py-2.5
        rounded-lg
        transition-colors duration-200
        text-sm font-medium
        ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        }
      `
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              className={`h-5 w-5 shrink-0 ${
                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
              }`}
            />
          )}
          <span className="truncate">{props.name}</span>
        </>
      )}
    </NavLink>
  );
}