// src/App.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getMe } from "@/features/auth/authSlice";
import ProtectedRoute from "@/components/utils/ProtectedRoute";

// pages (di folder pages/)
import Home from "@/pages/Home.jsx";
import InformasiWisata from "@/pages/informasiWisata.jsx";
import Reservasi from "@/pages/Reservasi.jsx";
import Berita from "@/pages/Berita.jsx";
import DetailBerita from "@/pages/DetailBerita.jsx";
import Dashboard from "@/pages/Dashboard.jsx";

// auth pages (di folder pages/auth/)
import Login from "@/pages/auth/Login.jsx";
import Register from "@/pages/auth/Register.jsx";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe()); // cek session saat app mount
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/informasi-wisata" element={<InformasiWisata />} />
        <Route path="/reservasi" element={<Reservasi />} />

        <Route path="/berita" element={<Berita />} />
        <Route path="/berita/:id" element={<DetailBerita />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* admin only */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  );
}
