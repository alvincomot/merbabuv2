// /api/controllers/NewsController.js
import prisma from "../config/prisma.js";
import { randomUUID } from "crypto";
import { del as blobDel } from "@vercel/blob";

// Kembalikan URL gambar yang valid (harus absolut dari Blob/CDN)
const toImageUrl = (_req, image) => {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image; // sudah URL (Blob/CDN)
  // Jika gambar lama masih filename & kamu punya CDN base, aktifkan ini:
  // const base = process.env.PUBLIC_IMAGES_BASE?.replace(/\/$/, "");
  // return base ? `${base}/${image}` : null;
  return null; // default aman di serverless
};

// Helper: parse :id (angka) dari params
const parseId = (val) => {
  const n = Number(val);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// GET /api/news
export const getNews = async (_req, res) => {
  try {
    const rows = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        judul: true,
        konten: true,
        image: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    });

    const data = rows.map((n) => ({ ...n, image: toImageUrl(null, n.image) }));
    return res.status(200).json(data);
  } catch (e) {
    console.error("getNews error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/news/:id
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
    return res.status(200).json({ ...n, image: toImageUrl(null, n.image) });
  } catch (e) {
    console.error("getNewsById error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/news  (admin)
export const createNews = async (req, res) => {
  try {
    const { judul, konten } = req.body;
    if (!judul || !konten) {
      return res.status(400).json({ message: "Field judul dan konten wajib diisi" });
    }

    // URL publik dari middleware upload (Vercel Blob)
    const image = req.fileUrl ?? null;

    const created = await prisma.news.create({
      data: {
        uuid: randomUUID(),
        judul,
        konten,
        image,
        userId: req.userId ?? null, // di-set oleh verifyUser
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

    return res.status(201).json({
      message: "News dibuat",
      news: { ...created, image: toImageUrl(null, created.image) },
    });
  } catch (e) {
    console.error("createNews error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/news/:id  (admin)
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

    return res.status(200).json({
      message: "News diperbarui",
      news: { ...updated, image: toImageUrl(null, updated.image) },
    });
  } catch (e) {
    console.error("updateNews error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/news/:id  (admin)
export const deleteNews = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    // Optional: hapus dari Blob jika image adalah URL Blob
    const existing = await prisma.news.findUnique({
      where: { id },
      select: { image: true },
    });
    if (!existing) return res.status(404).json({ message: "News not found" });

    if (existing.image?.startsWith("https://blob.vercel-storage.com/")) {
      try {
        await blobDel(existing.image, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      } catch (err) {
        console.warn("Blob delete failed (ignored):", err?.message || err);
      }
    }

    await prisma.news.delete({ where: { id } });
    return res.status(200).json({ message: "News dihapus" });
  } catch (e) {
    console.error("deleteNews error:", e);
    if (e.code === "P2025") {
      return res.status(404).json({ message: "News not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
