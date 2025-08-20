// /api/routes/UserRoute.js
import { Router } from "express";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";

const router = Router();

// Base dari index.js: /api/users
router.get("/", verifyUser, adminOnly, getUsers);
router.get("/:id", verifyUser, adminOnly, getUserById);
router.post("/", verifyUser, adminOnly, createUser);
router.patch("/:id", verifyUser, adminOnly, updateUser);
router.delete("/:id", verifyUser, adminOnly, deleteUser);

export default router;
