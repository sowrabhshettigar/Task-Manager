import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../features/dashboard/pages/Dashboard";
import AppLayout from "../shared/layout/AppLayout";
import {
  TaskList,
  CreateTask,
  EditTask,
  TaskDetails,
} from "../features/tasks/pages";
import Profile from "../features/profile/pages/Profile";
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="task">
          <Route index element={<TaskList />} />
          <Route path=":id" element={<TaskDetails />} />
          <Route path="create" element={<CreateTask />} />
          <Route path="edit/:id" element={<EditTask />} />
        </Route>

        <Route path="Profile">
          <Route index element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
