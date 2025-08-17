import axios from "axios";

function computeBaseURL() {
  let base = import.meta.env.VITE_API_URL;

  if (!base) {
    return "/api";
  }

  base = base.replace(/\/$/, ""); 
  if (!/\/api$/.test(base)) base += "/api";
  return base;
}

const api = axios.create({
  baseURL: computeBaseURL(),
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

export default api;
