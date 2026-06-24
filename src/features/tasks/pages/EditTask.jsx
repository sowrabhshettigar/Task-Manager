import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskById, updateTask } from "../services/tasks.api";
import TaskForm from "../components/TaskForm";

function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTaskById(id);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      await updateTask(id, taskData);
      navigate("/task");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Edit Task</h1>
      </div>
      <div className="p-6">
        <TaskForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleUpdate}
          onCancel={() => navigate("/task")}
          submitLabel="Update Task"
        />
      </div>
    </div>
  );
}
export default EditTask;
