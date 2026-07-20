import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { createTask } from "../services/tasks.api";

function CreateTask() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const taskData = {
      ...formData,
      createdAt: now,
      updatedAt: now,
      completedAt: formData.status === "completed" ? now : null,
    };
    await createTask(taskData);
    navigate("/task");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Add New Task</h1>
      </div>
      <div className="p-6">
        <TaskForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          onCancel={() => navigate("/task")}
          submitLabel="Add Task"
        />
      </div>
    </div>
  );
}

export default CreateTask;
