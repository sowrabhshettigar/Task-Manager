import API from "../../../services/http";

export const getTasks=()=>API.get("/tasks"); 