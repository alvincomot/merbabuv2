import express from "express";
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/NewsController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import upload from "../middleware/UploadMiddleware.js";

const router = express.Router();

router.get("/news", getNews);
router.get("/news/:id", getNewsById);
router.post("/news", verifyUser, adminOnly, upload.single("image"), createNews);
router.patch("/news/:id", verifyUser, adminOnly, upload.single("image"), updateNews);
router.delete("/news/:id", verifyUser, adminOnly, deleteNews);

export default router;
