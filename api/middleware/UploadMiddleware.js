import express from "express";
import {
  getReservasi,
  getReservasiById,
  createReservasi,
  updateReservasi,
  deleteReservasi,
} from "../controllers/ReservasiController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import { upload, makeUploadToBlob } from "../middleware/UploadMiddleware.js";

const router = express.Router();
const uploadToBlobReservasi = makeUploadToBlob("reservasi");

router.get("/reservasi", getReservasi);
router.get("/reservasi/:id", getReservasiById);
router.post(
  "/reservasi",
  verifyUser, adminOnly,
  upload.single("image"),
  uploadToBlobReservasi,
  createReservasi
);
router.patch(
  "/reservasi/:id",
  verifyUser, adminOnly,
  upload.single("image"),
  uploadToBlobReservasi,
  updateReservasi
);
router.delete(
  "/reservasi/:id",
  verifyUser, adminOnly,
  deleteReservasi
);

export default router;
