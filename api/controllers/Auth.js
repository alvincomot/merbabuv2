// /api/controllers/Auth.js
import prisma from "../config/prisma.js";
import argon2 from "argon2";
import { randomUUID } from "crypto";

const COOKIE_NAME = "sid"; // samakan dengan index.js (session name)
const isProd = process.env.NODE_ENV === "production";

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const userUuid = req.session?.userId;
    if (!userUuid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { uuid: userUuid },
      select: { uuid: true, name: true, email: true, role: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (e) {
    console.error("getMe error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/auth/register
export const Register = async (req, res) => {
  try {
    let { name, email, password, confPassword, role } = req.body;

    name = String(name || "").trim();
    email = String(email || "").trim().toLowerCase();

    if (!name || !email || !password || !confPassword) {
      return res.status(400).json({ message: "Field wajib diisi" });
    }
    if (password !== confPassword) {
      return res.status(400).json({ message: "Password tidak cocok" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email sudah terpakai" });

    const hash = await argon2.hash(password);
    const user = await prisma.user.create({
      data: {
        uuid: randomUUID(),
        name,
        email,
        password: hash,
        role: role || "user",
      },
      select: { uuid: true, name: true, email: true, role: true },
    });

    return res.status(201).json({ message: "Registrasi berhasil", user });
  } catch (e) {
    console.error("Register error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/auth/login
export const Login = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const ok = await argon2.verify(user.password, password);
    if (!ok) return res.status(400).json({ message: "Password salah" });

    // simpan UUID ke session
    req.session.userId = user.uuid;

    // opsional: paksa browser menulis ulang cookie dgn opsi yg sama
    res.cookie?.(COOKIE_NAME, req.session.id, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Login sukses",
      user: { uuid: user.uuid, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/auth/logout  (atau POST kalau kamu mau)
export const LogOut = async (req, res) => {
  try {
    // destroy session di store
    req.session?.destroy?.(() => {});
    // hapus cookie (opsi harus sama dgn saat set)
    res.clearCookie?.(COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json({ message: "Logout sukses" });
  } catch (e) {
    console.error("Logout error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
