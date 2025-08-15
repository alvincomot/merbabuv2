import prisma from "../config/prisma.js";

const apiBase = (req) =>
  process.env.BACKEND_URL?.replace(/\/$/, "") ||
  `${req.protocol}://${req.get("host")}/api`;
const toImageUrl = (req, image) => (!image ? null : (/^https?:\/\//i.test(image) ? image : `${apiBase(req)}/images/${image}`));

// GET /reservasi
export const getReservasi = async (_req, res) => {
  try {
    const rows = await prisma.reservasi.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(rows.map(r => ({ ...r, image: toImageUrl(_req, r.image) })));
  } catch (e) {
    console.error("getReservasi", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /reservasi/:id
export const getReservasiById = async (req, res) => {
  try {
    const r = await prisma.reservasi.findUnique({ where: { id: Number(req.params.id) } });
    if (!r) return res.status(404).json({ message: "Reservasi not found" });
    res.status(200).json({ ...r, image: toImageUrl(req, r.image) });
  } catch (e) {
    console.error("getReservasiById", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /reservasi  (admin)
export const createReservasi = async (req, res) => {
  try {
    const { judul, deskripsi_singkat, nomor_whatsapp, pesan_whatsapp } = req.body;
    const image = req.fileUrl ?? null;

    const r = await prisma.reservasi.create({
      data: { judul, deskripsi_singkat, image, nomor_whatsapp, pesan_whatsapp },
    });
    res.status(201).json({ message: "Reservasi dibuat", reservasi: { ...r, image: toImageUrl(req, r.image) } });
  } catch (e) {
    console.error("createReservasi", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /reservasi/:id  (admin)
export const updateReservasi = async (req, res) => {
  try {
    const existing = await prisma.reservasi.findUnique({ where: { id: Number(req.params.id) } });
    if (!existing) return res.status(404).json({ message: "Reservasi not found" });

    const { judul, deskripsi_singkat, nomor_whatsapp, pesan_whatsapp } = req.body;
    const image = req.fileUrl ?? existing.image;

    const r = await prisma.reservasi.update({
      where: { id: Number(req.params.id) },
      data: {
        judul: judul ?? undefined,
        deskripsi_singkat: deskripsi_singkat ?? undefined,
        nomor_whatsapp: nomor_whatsapp ?? undefined,
        pesan_whatsapp: pesan_whatsapp ?? undefined,
        image,
      },
    });
    res.status(200).json({ message: "Reservasi diperbarui", reservasi: { ...r, image: toImageUrl(req, r.image) } });
  } catch (e) {
    console.error("updateReservasi", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /reservasi/:id  (admin)
export const deleteReservasi = async (req, res) => {
  try {
    await prisma.reservasi.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ message: "Reservasi dihapus" });
  } catch (e) {
    console.error("deleteReservasi", e);
    if (e.code === "P2025") return res.status(404).json({ message: "Reservasi not found" });
    res.status(500).json({ message: "Internal server error" });
  }
};
