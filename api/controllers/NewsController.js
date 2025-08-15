import prisma from "../config/prisma.js";

const apiBase = (req) =>
  process.env.BACKEND_URL?.replace(/\/$/, "") ||
  `${req.protocol}://${req.get("host")}/api`;

const toImageUrl = (req, image) => {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;
  return `${apiBase(req)}/images/${image}`;
};

// GET /news
export const getNews = async (_req, res) => {
  try {
    const rows = await prisma.news.findMany({
      select: { uuid: true, judul: true, konten: true, image: true, createdAt: true, userId: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(rows.map(n => ({ ...n, image: toImageUrl(_req, n.image) })));
  } catch (e) {
    console.error("getNews", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /news/:id
export const getNewsById = async (req, res) => {
  try {
    const n = await prisma.news.findUnique({
      where: { uuid: req.params.id },
      select: { uuid: true, judul: true, konten: true, image: true, createdAt: true, userId: true },
    });
    if (!n) return res.status(404).json({ message: "News not found" });
    res.status(200).json({ ...n, image: toImageUrl(req, n.image) });
  } catch (e) {
    console.error("getNewsById", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /news  (admin)
export const createNews = async (req, res) => {
  try {
    const { judul, konten } = req.body;
    const image = req.fileUrl ?? null;
    const news = await prisma.news.create({
      data: {
        uuid: crypto.randomUUID(),
        judul,
        konten,
        image,
        userId: req.userId ?? null,
      },
      select: { uuid: true, judul: true, konten: true, image: true, createdAt: true },
    });
    res.status(201).json({ message: "News dibuat", news: { ...news, image: toImageUrl(req, news.image) } });
  } catch (e) {
    console.error("createNews", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /news/:id  (admin)
export const updateNews = async (req, res) => {
  try {
    const existing = await prisma.news.findUnique({ where: { uuid: req.params.id }, select: { image: true } });
    if (!existing) return res.status(404).json({ message: "News not found" });

    const { judul, konten } = req.body;
    const image = req.fileUrl ?? existing.image;

    const news = await prisma.news.update({
      where: { uuid: req.params.id },
      data: { judul: judul ?? undefined, konten: konten ?? undefined, image },
      select: { uuid: true, judul: true, konten: true, image: true, createdAt: true },
    });

    res.status(200).json({ message: "News diperbarui", news: { ...news, image: toImageUrl(req, news.image) } });
  } catch (e) {
    console.error("updateNews", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /news/:id  (admin)
export const deleteNews = async (req, res) => {
  try {
    await prisma.news.delete({ where: { uuid: req.params.id } });
    res.status(200).json({ message: "News dihapus" });
  } catch (e) {
    console.error("deleteNews", e);
    if (e.code === "P2025") return res.status(404).json({ message: "News not found" });
    res.status(500).json({ message: "Internal server error" });
  }
};
