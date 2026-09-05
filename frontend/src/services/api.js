import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-exam-portal-plmw.onrender.com"
});

export default api;
