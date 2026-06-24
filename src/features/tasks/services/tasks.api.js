import API from "../../../services/http";

export const getTasks = () => API.get("/tasks");

export const createTask = (payload) => API.post("/tasks", payload);

export const getTaskById = (taskId) => API.get(`/tasks/${taskId}`);

export const updateTask = (taskId, updatedTask) =>
  API.put(`/tasks/${taskId}`, updatedTask);

export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}`);
