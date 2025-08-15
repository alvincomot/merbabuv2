// src/api/axios.js
import axios from "axios";

function computeBaseURL() {
  // Bisa di-set di Vercel: VITE_API_URL = https://merbabuv2.vercel.app  (tanpa /api)
  // atau tidak diset (fallback ke same-origin)
  let base = import.meta.env.VITE_API_URL;

  if (!base) {
    // Same-origin + prefix /api
    return "/api";
  }

  base = base.replace(/\/$/, ""); // hapus trailing slash
  // Tambah /api jika belum ada
  if (!/\/api$/.test(base)) base += "/api";
  return base;
}

const api = axios.create({
  baseURL: computeBaseURL(),
  withCredentials: true, // perlu untuk cookie session
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

export default api;
