import { Router } from "express";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import { upload, uploadToBlob } from "../middleware/UploadMiddleware.js";
import {
  getReservasi,
  getReservasiById,
  createReservasi,
  updateReservasi,
  deleteReservasi,
} from "../controllers/ReservasiController.js";

const router = Router();

router.get("/", getReservasi);
router.get("/:id", getReservasiById);

router.post("/", verifyUser, adminOnly, upload.single("image"), uploadToBlob, createReservasi);
router.patch("/:id", verifyUser, adminOnly, upload.single("image"), uploadToBlob, updateReservasi);
router.delete("/:id", verifyUser, adminOnly, deleteReservasi);

export default router;
