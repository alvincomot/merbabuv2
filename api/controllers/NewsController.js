import News from "../models/NewsModel.js";
import User from "../models/UserModel.js";
import path from "path";
import fs from "fs";

// Mengambil semua berita (Publik)
export const getNews = async (req, res) => {
  try {
    const response = await News.findAll({
      attributes: ["id", "uuid", "judul", "image", "konten", "createdAt"],
      include: [{ model: User, attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengambil satu berita (Publik)
export const getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findOne({
      where: { id: req.params.id },
      include: [{ model: User, attributes: ["name"] }],
    });
    if (!newsItem)
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    res.status(200).json(newsItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Membuat berita baru (Admin)
export const createNews = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "File gambar wajib diunggah." });

  const { judul, konten } = req.body;
  const fileName = req.file.filename;
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    const newNews = await News.create({
      judul: judul,
      konten: konten,
      image: imageUrl,
    });
    res.status(201).json({ message: "Berita berhasil dibuat", news: newNews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengupdate berita (Admin)
export const updateNews = async (req, res) => {
  try {
    const newsItem = await News.findOne({ where: { id: req.params.id } });
    if (!newsItem)
      return res.status(404).json({ message: "Berita tidak ditemukan" });

    let imageUrl = newsItem.image;
    if (req.file) {
      if (newsItem.image) {
        const oldImageName = newsItem.image.split("/images/")[1];
        const oldImagePath = path.join("public/images", oldImageName);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    }

    const { judul, konten } = req.body;
    await newsItem.update({ judul, konten, image: imageUrl });

    res
      .status(200)
      .json({ message: "Berita berhasil diperbarui", news: newsItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menghapus berita (Admin)
export const deleteNews = async (req, res) => {
  try {
    const newsItem = await News.findOne({ where: { id: req.params.id } });
    if (!newsItem)
      return res.status(404).json({ message: "Berita tidak ditemukan" });

    if (newsItem.image) {
      const oldImageName = newsItem.image.split("/images/")[1];
      const oldImagePath = path.join("public/images", oldImageName);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    await newsItem.destroy();
    res.status(200).json({ message: "Berita berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
