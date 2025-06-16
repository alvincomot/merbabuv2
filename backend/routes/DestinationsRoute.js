import express from 'express';
import {
    getDestinations,
    getDestinationsById,
    createDestinations,
    updateDestinations,
    deleteDestinations
} from "../controllers/DestinationsController.js";

const router = express.Router();

router.get('/Destinations', getDestinations);
router.get('/Destinations/:id', getDestinationsById);
router.post('/Destinations', createDestinations);
router.patch('/Destinations/:id', updateDestinations);
router.delete('/Destinations/:id', deleteDestinations);

export default router;