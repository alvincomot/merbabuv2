// src/components/utils/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Pakai: <ProtectedRoute roles={['admin']}>...</ProtectedRoute>
 * - roles opsional; kalau tidak diisi, cukup cek sudah login saja
 */
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, status } = useSelector((s) => s.auth);
  const location = useLocation();

  // Tunggu sampai auth slice selesai (mis. getMe) biar tidak salah redirect
  if (status === 'loading' || status === 'idle') {
    return null; // atau spinner/loading kecil
  }

  // Belum login -> ke login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ada pembatasan role, tapi user tidak termasuk
  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(user.role)) {
    // Arahkan ke halaman awal atau 403 page
    return <Navigate to="/" replace />;
  }

  // Lolos semua cek
  return children;
};

export default ProtectedRoute;
