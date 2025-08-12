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

router.get('/reservasi', getLayananReservasi);
router.post('/reservasi', verifyUser, adminOnly, upload.single('image'), createLayananReservasi);
router.patch('/reservasi/:id', verifyUser, adminOnly, upload.single('image'), updateLayananReservasi);
router.delete('/reservasi/:id', verifyUser, adminOnly, deleteLayananReservasi);

export default router;