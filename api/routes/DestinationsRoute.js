// api/routes/DestinationsRoute.js
import { Router } from "express";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import { upload, uploadToBlob } from "../middleware/UploadMiddleware.js";
import {
  getDestinations,
  getDestinationsById,
  createDestinations,
  updateDestinations,
  deleteDestinations,
} from "../controllers/DestinationsController.js";

const router = Router();

// publik
router.get("/", getDestinations);
router.get("/:id", getDestinationsById);

// butuh login/admin + upload ke Blob
router.post("/", verifyUser, adminOnly, upload.single("image"), uploadToBlob, createDestinations);
router.patch("/:id", verifyUser, adminOnly, upload.single("image"), uploadToBlob, updateDestinations);
router.delete("/:id", verifyUser, adminOnly, deleteDestinations);

export default router;
