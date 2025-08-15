// api/controllers/NewsController.js
import prisma from "../config/prisma.js";
// Node 18+ punya global crypto.randomUUID, tapi untuk aman:
import { randomUUID } from "crypto";

/** Base URL API (/api) untuk fallback file lokal */
const apiBase = (req) =>
  process.env.BACKEND_URL?.replace(/\/$/, "") ||
  `${req.protocol}://${req.get("host")}/api`;

/** Bangun URL publik untuk field image */
const toImageUrl = (req, image) => {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image; // sudah URL (Blob/S3)
  return `${apiBase(req)}/images/${image}`; // fallback nama file
};

/** Helper: parse :id (angka) dari params, kembalikan null jika invalid */
const parseId = (val) => {
  const n = Number(val);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// GET /news
export const getNews = async (req, res) => {
  try {
    const rows = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        judul: true,
        konten: true,
        image: true,
        createdAt: true,
        user: { select: { name: true } }, // relasi utk tampilan "Oleh {user.name}"
      },
    });

    const data = rows.map((n) => ({
      ...n,
      image: toImageUrl(req, n.image),
    }));

    res.status(200).json(data);
  } catch (e) {
    console.error("getNews error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /news/:id  (id = integer Prisma)
export const getNewsById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const n = await prisma.news.findUnique({
      where: { id },
      select: {
        id: true,
        judul: true,
        konten: true,
        image: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    });

    if (!n) return res.status(404).json({ message: "News not found" });

    res.status(200).json({ ...n, image: toImageUrl(req, n.image) });
  } catch (e) {
    console.error("getNewsById error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /news  (admin)
export const createNews = async (req, res) => {
  try {
    const { judul, konten } = req.body;

    if (!judul || !konten) {
      return res
        .status(400)
        .json({ message: "Field judul dan konten wajib diisi" });
    }

    // URL publik dari middleware upload (mis. Vercel Blob)
    const image = req.fileUrl ?? null;

    const created = await prisma.news.create({
      data: {
        uuid: randomUUID(), // masih simpan uuid kalau ingin—nggak dipakai di route
        judul,
        konten,
        image,
        userId: req.userId ?? null, // pastikan middleware sesi set req.userId
      },
      select: {
        id: true,
        judul: true,
        konten: true,
        image: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    });

    res.status(201).json({
      message: "News dibuat",
      news: { ...created, image: toImageUrl(req, created.image) },
    });
  } catch (e) {
    console.error("createNews error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /news/:id  (admin)
export const updateNews = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const existing = await prisma.news.findUnique({
      where: { id },
      select: { image: true },
    });
    if (!existing) return res.status(404).json({ message: "News not found" });

    const { judul, konten } = req.body;
    const image = req.fileUrl ?? existing.image;

    const updated = await prisma.news.update({
      where: { id },
      data: {
        judul: judul ?? undefined,
        konten: konten ?? undefined,
        image,
      },
      select: {
        id: true,
        judul: true,
        konten: true,
        image: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    });

    res.status(200).json({
      message: "News diperbarui",
      news: { ...updated, image: toImageUrl(req, updated.image) },
    });
  } catch (e) {
    console.error("updateNews error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /news/:id  (admin)
export const deleteNews = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    await prisma.news.delete({ where: { id } });
    res.status(200).json({ message: "News dihapus" });
  } catch (e) {
    console.error("deleteNews error:", e);
    // P2025 = record not found saat delete
    if (e.code === "P2025") {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
