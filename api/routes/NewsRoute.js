// /api/routes/NewsRoute.js
import { Router } from "express";
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/NewsController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import { upload, uploadToBlob } from "../middleware/UploadMiddleware.js";

const router = Router();

// Base dari index.js: /api/news
router.get("/", getNews);
router.get("/:id", getNewsById);

router.post(
  "/",
  verifyUser,
  adminOnly,
  upload.single("image"),
  uploadToBlob,
  createNews
);

router.patch(
  "/:id",
  verifyUser,
  adminOnly,
  upload.single("image"),
  uploadToBlob,
  updateNews
);

router.delete("/:id", verifyUser, adminOnly, deleteNews);

export default router;
