import { NavLink } from "react-router-dom";

export default function Sidebar(props) {
  return (
    <NavLink
      to={props.to}
      end
      className={({ isActive }) =>
        `
        flex items-center
        px-4 py-3
        rounded-lg
        transition-all duration-200
        font-medium
        ${
          isActive
            ? "bg-blue-500 text-white shadow-md"
            : "text-slate-700 hover:bg-slate-100"
        }
      `
      }
    >
      <span>{props.name}</span>
    </NavLink>
  );
}