import prisma from "../config/prisma.js";
import argon2 from "argon2";
import { randomUUID } from "crypto";

// GET /auth/me
export const getMe = async (req, res) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await prisma.user.findUnique({
    where: { uuid: req.session.userId },
    select: { uuid: true, name: true, email: true, role: true },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
};

// POST /auth/register
export const Register = async (req, res) => {
  try {
    const { name, email, password, confPassword, role } = req.body;
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
    res.status(201).json({ message: "Registrasi berhasil", user });
  } catch (e) {
    console.error("Register error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /auth/login
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const ok = await argon2.verify(user.password, password);
    if (!ok) return res.status(400).json({ message: "Password salah" });

    // simpan UUID ke session
    req.session.userId = user.uuid;

    res.status(200).json({
      message: "Login sukses",
      user: { uuid: user.uuid, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /auth/logout  (atau POST)
export const LogOut = async (req, res) => {
  try {
    req.session?.destroy?.(() => {});
    res.clearCookie?.("sid"); // samakan dengan name cookie di session()
    return res.status(200).json({ message: "Logout sukses" });
  } catch (e) {
    console.error("Logout error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
