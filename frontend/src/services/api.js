import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // backend do Spring Boot
});

export default api;
