// file: backend/routes/ReservasiRoute.js

import express from 'express';
import {
    getLayananReservasi,
    createLayananReservasi,
    updateLayananReservasi,
    deleteLayananReservasi
} from "../controllers/ReservasiController.js";
import { verifyUser, adminOnly } from '../middleware/AuthUser.js';
import upload from '../middleware/UploadMiddleware.js';

const router = express.Router();

// === ROUTE PUBLIK ===
// Untuk menampilkan semua layanan di halaman /reservasi
router.get('/reservasi', getLayananReservasi);

// === ROUTE KHUSUS ADMIN ===
// Untuk membuat layanan baru
router.post('/reservasi', verifyUser, adminOnly, upload.single('image'), createLayananReservasi);

// Untuk mengupdate layanan berdasarkan ID
router.patch('/reservasi/:id', verifyUser, adminOnly, upload.single('image'), updateLayananReservasi);

// Untuk menghapus layanan berdasarkan ID
router.delete('/reservasi/:id', verifyUser, adminOnly, deleteLayananReservasi);

export default router;