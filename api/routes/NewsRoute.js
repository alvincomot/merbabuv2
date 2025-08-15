import { Router } from "express";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import { upload, uploadToBlob } from "../middleware/UploadMiddleware.js";
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/NewsController.js";

const router = Router();

router.get("/", getNews);
router.get("/:id", getNewsById);

router.post("/", verifyUser, adminOnly, upload.single("image"), uploadToBlob, createNews);
router.patch("/:id", verifyUser, adminOnly, upload.single("image"), uploadToBlob, updateNews);
router.delete("/:id", verifyUser, adminOnly, deleteNews);

export default router;
