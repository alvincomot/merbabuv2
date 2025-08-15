import prisma from "../config/prisma.js";
import argon2 from "argon2";
import { randomUUID } from "crypto";

// GET /users
export const getUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { uuid: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(users);
  } catch (e) {
    console.error("getUsers", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /users/:id (uuid)
export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { uuid: req.params.id },
      select: { uuid: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (e) {
    console.error("getUserById", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /users  (admin)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Field wajib diisi" });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email sudah terpakai" });

    const hash = await argon2.hash(password);
    const user = await prisma.user.create({
      data: { uuid: randomUUID(), name, email, password: hash, role: role || "user" },
      select: { uuid: true, name: true, email: true, role: true },
    });
    res.status(201).json({ message: "User dibuat", user });
  } catch (e) {
    console.error("createUser", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /users/:id  (admin)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const data = {
      name: name ?? undefined,
      email: email ?? undefined,
      role: role ?? undefined,
    };
    if (password) data.password = await argon2.hash(password);

    const updated = await prisma.user.update({
      where: { uuid: req.params.id },
      data,
      select: { uuid: true, name: true, email: true, role: true },
    });
    res.status(200).json({ message: "User diperbarui", user: updated });
  } catch (e) {
    console.error("updateUser", e);
    if (e.code === "P2025") return res.status(404).json({ message: "User not found" });
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /users/:id (admin)
export const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { uuid: req.params.id } });
    res.status(200).json({ message: "User dihapus" });
  } catch (e) {
    console.error("deleteUser", e);
    if (e.code === "P2025") return res.status(404).json({ message: "User not found" });
    res.status(500).json({ message: "Internal server error" });
  }
};
