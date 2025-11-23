import axios from "axios";
const baseURL = process.env.VITE_API_URL || "http://localhost:8000";
const instance = axios.create({ baseURL, headers: {"Content-Type":"application/json"} });
const token = localStorage.getItem("token");
if(token) instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
export default instance;
