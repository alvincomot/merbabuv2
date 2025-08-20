// /api/controllers/ReservasiController.js
import prisma from "../config/prisma.js";
import { del as blobDel } from "@vercel/blob";

// Kembalikan URL gambar yang valid (harus absolut dari Blob/CDN)
const toImageUrl = (_req, image) => {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image; // sudah URL (Blob/CDN)
  // Jika masih filename lama & kamu punya CDN base, aktifkan ini:
  // const base = process.env.PUBLIC_IMAGES_BASE?.replace(/\/$/, "");
  // return base ? `${base}/${image}` : null;
  return null; // default aman di serverless
};

// Aman-parse id integer
const parseId = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// GET /api/reservasi
export const getReservasi = async (_req, res) => {
  try {
    const rows = await prisma.reservasi.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        judul: true,
        deskripsi_singkat: true,
        image: true,
        nomor_whatsapp: true,
        pesan_whatsapp: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const data = rows.map((r) => ({ ...r, image: toImageUrl(null, r.image) }));
    return res.status(200).json(data);
  } catch (e) {
    console.error("getReservasi error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/reservasi/:id
export const getReservasiById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const r = await prisma.reservasi.findUnique({
      where: { id },
      select: {
        id: true,
        judul: true,
        deskripsi_singkat: true,
        image: true,
        nomor_whatsapp: true,
        pesan_whatsapp: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!r) return res.status(404).json({ message: "Reservasi not found" });
    return res.status(200).json({ ...r, image: toImageUrl(null, r.image) });
  } catch (e) {
    console.error("getReservasiById error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/reservasi  (admin)
export const createReservasi = async (req, res) => {
  try {
    const { judul, deskripsi_singkat, nomor_whatsapp, pesan_whatsapp } = req.body;

    if (!judul || !deskripsi_singkat) {
      return res.status(400).json({ message: "judul dan deskripsi_singkat wajib diisi" });
    }

    // URL publik hasil upload (dari middleware upload ke Blob)
    const image = req.fileUrl ?? null;

    const r = await prisma.reservasi.create({
      data: { judul, deskripsi_singkat, image, nomor_whatsapp, pesan_whatsapp },
      select: {
        id: true,
        judul: true,
        deskripsi_singkat: true,
        image: true,
        nomor_whatsapp: true,
        pesan_whatsapp: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      message: "Reservasi dibuat",
      reservasi: { ...r, image: toImageUrl(null, r.image) },
    });
  } catch (e) {
    console.error("createReservasi error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/reservasi/:id  (admin)
export const updateReservasi = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const existing = await prisma.reservasi.findUnique({
      where: { id },
      select: { image: true },
    });
    if (!existing) return res.status(404).json({ message: "Reservasi not found" });

    const { judul, deskripsi_singkat, nomor_whatsapp, pesan_whatsapp } = req.body;
    const image = req.fileUrl ?? existing.image;

    const r = await prisma.reservasi.update({
      where: { id },
      data: {
        judul: judul ?? undefined,
        deskripsi_singkat: deskripsi_singkat ?? undefined,
        nomor_whatsapp: nomor_whatsapp ?? undefined,
        pesan_whatsapp: pesan_whatsapp ?? undefined,
        image,
      },
      select: {
        id: true,
        judul: true,
        deskripsi_singkat: true,
        image: true,
        nomor_whatsapp: true,
        pesan_whatsapp: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: "Reservasi diperbarui",
      reservasi: { ...r, image: toImageUrl(null, r.image) },
    });
  } catch (e) {
    console.error("updateReservasi error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/reservasi/:id  (admin)
export const deleteReservasi = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    // Optional: hapus file Blob jika URL-nya dari Blob
    const existing = await prisma.reservasi.findUnique({
      where: { id },
      select: { image: true },
    });
    if (!existing) return res.status(404).json({ message: "Reservasi not found" });

    if (existing.image?.startsWith("https://blob.vercel-storage.com/")) {
      try {
        await blobDel(existing.image, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch (err) {
        console.warn("Blob delete failed (ignored):", err?.message || err);
      }
    }

    await prisma.reservasi.delete({ where: { id } });
    return res.status(200).json({ message: "Reservasi dihapus" });
  } catch (e) {
    console.error("deleteReservasi error:", e);
    if (e.code === "P2025") return res.status(404).json({ message: "Reservasi not found" });
    return res.status(500).json({ message: "Internal server error" });
  }
};
