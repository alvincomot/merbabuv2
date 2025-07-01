import express from 'express';
import {
    getDestinations,
    getDestinationsById,
    createDestinations,
    updateDestinations,
    deleteDestinations
} from "../controllers/DestinationsController.js";
import { verifyUser, adminOnly } from '../middleware/AuthUser.js';
import upload from "../middleware/UploadMiddleware.js";

const router = express.Router();

router.get('/Destinations', getDestinations);
router.get('/Destinations/:id', getDestinationsById);
router.post('/destinations', verifyUser, adminOnly, upload.single('image'), createDestinations);
router.patch('/destinations/:id', verifyUser, adminOnly, upload.single('image'), updateDestinations);
router.delete('/Destinations/:id',verifyUser, adminOnly, deleteDestinations);

export default router;