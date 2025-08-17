// /api/controllers/DestinationsController.js
import prisma from "../config/prisma.js";
import { withTimeout } from "../utils/withTimeout.js";
import { del as blobDel } from "@vercel/blob";

const apiBase = (req) =>
  (process.env.BACKEND_URL?.replace(/\/$/, "") ||
    `${req.protocol}://${req.get("host")}`) + "/api";

const toImageUrl = (req, image) => {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;
  return `${apiBase(req)}/images/${image}`;
};

export const getDestinations = async (req, res) => {
  try {
    const rows = await withTimeout(
      prisma.destination.findMany({
        select: { uuid: true, name: true, description: true, image: true, location: true },
        orderBy: { name: "asc" },
      })
    );

    const data = rows.map((d) => ({ ...d, image: toImageUrl(req, d.image) }));
    return res.status(200).json(data);
  } catch (error) {
    console.error("getDestinations (Prisma) error:", error);
    const msg = /timeout/i.test(error.message) ? "Database timeout" : "Internal server error";
    return res.status(500).json({ message: msg});
  }
};

export const getDestinationsById = async (req, res) => {
  try {
    const d = await prisma.destination.findUnique({
      where: { uuid: req.params.id },
      select: { uuid: true, name: true, description: true, image: true, location: true },
    });
    if (!d) return res.status(404).json({ message: "Destination not found" });
    return res.status(200).json({ ...d, image: toImageUrl(req, d.image) });
  } catch (error) {
    console.error("getDestinationsById (Prisma) error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createDestinations = async (req, res) => {
  try {
    const { name, description, location } = req.body;

    if (!name || !description || !location) {
      return res.status(400).json({ message: "name/description/location wajib diisi" });
    }

    const image = req.fileUrl ?? req.file?.filename ?? null;

    const created = await prisma.destination.create({
      data: { name, description, location, image },
      select: { uuid: true, name: true, description: true, image: true, location: true },
    });

    return res.status(201).json({
      message: "Destinasi berhasil dibuat",
      destination: { ...created, image: toImageUrl(req, created.image) },
    });
  } catch (error) {
    console.error("createDestinations (Prisma) error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDestinations = async (req, res) => {
  try {
    const existing = await prisma.destination.findUnique({
      where: { uuid: req.params.id },
      select: { image: true },
    });
    if (!existing) return res.status(404).json({ message: "Data tidak ditemukan" });

    const { name, description, location } = req.body;
    const newImage = req.fileUrl ?? req.file?.filename ?? existing.image;

    const updated = await prisma.destination.update({
      where: { uuid: req.params.id },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        location: location ?? undefined,
        image: newImage,
      },
      select: { uuid: true, name: true, description: true, image: true, location: true },
    });

    return res.status(200).json({
      message: "Destinasi berhasil diperbarui",
      destination: { ...updated, image: toImageUrl(req, updated.image) },
    });
  } catch (error) {
    console.error("updateDestinations (Prisma) error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDestinations = async (req, res) => {
  try {
    const existing = await prisma.destination.findUnique({
      where: { uuid: req.params.id },
      select: { image: true },
    });
    if (!existing) return res.status(404).json({ message: "Destination not found" });

    if (existing.image?.startsWith("https://blob.vercel-storage.com/")) {
      try {
        await blobDel(existing.image, {
          token: process.env.BLOB_READ_WRITE_TOKEN, // jika project blob kamu butuh token
        });
      } catch (e) {
        console.warn("Blob delete failed (ignored):", e?.message || e);
      }
    }

    await prisma.destination.delete({ where: { uuid: req.params.id } });
    return res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("deleteDestinations (Prisma) error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
