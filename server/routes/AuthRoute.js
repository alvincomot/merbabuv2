// /api/routes/AuthRoute.js
import { Router } from "express";
import { getMe, Register, Login, LogOut } from "../controllers/Auth.js";

const router = Router();

// Base path dari index.js: /api/auth
router.get("/me", getMe);
router.post("/register", Register);
router.post("/login", Login);
router.delete("/logout", LogOut); // boleh POST juga

export default router;
