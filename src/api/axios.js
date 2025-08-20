import axios from "axios";

function computeBaseURL() {
  let base = import.meta.env.VITE_API_URL;

  if (!base) return "/api"; // default fallback

  // Hapus trailing slash (biar konsisten)
  base = base.replace(/\/$/, "");

  // Pastikan selalu ada "/api" di belakang
  if (!/\/api$/i.test(base)) base += "/api";

  return base;
}

const api = axios.create({
  baseURL: computeBaseURL(),
  withCredentials: true, // penting untuk kirim cookie (session JWT, CSRF, dll.)
  headers: {
    "X-Requested-With": "XMLHttpRequest", // info tambahan untuk backend
  },
});

export default api;
