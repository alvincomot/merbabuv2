// api/routes/DestinationsRoute.js
import express from "express";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import { upload, uploadToBlob } from "../middleware/UploadMiddleware.js";
import {
  getDestinations,
  getDestinationsById,
  createDestinations,
  updateDestinations,
  deleteDestinations,
} from "../controllers/DestinationsController.js";

const router = express.Router();

router.get("/destinations", getDestinations);
router.get("/destinations/:id", getDestinationsById);

// urutan penting: upload.single(...) dulu, baru uploadToBlob, baru controller
router.post(
  "/destinations",
  verifyUser,
  adminOnly,
  upload.single("image"),
  uploadToBlob,
  createDestinations
);

router.patch(
  "/destinations/:id",
  verifyUser,
  adminOnly,
  upload.single("image"),
  uploadToBlob,
  updateDestinations
);

router.delete("/destinations/:id", verifyUser, adminOnly, deleteDestinations);

export default router;
