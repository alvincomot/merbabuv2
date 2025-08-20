// api/middleware/UploadMiddleware.js
import multer from "multer";
import { put } from "@vercel/blob";

// Simpan file di memori (dibutuhkan untuk upload ke Blob)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }, // max 4 MB (aman di Vercel)
  fileFilter: (req, file, cb) => {
    const ok = /png|jpg|jpeg/i.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Hanya png/jpg/jpeg"));
  },
});

// Middleware untuk mengunggah buffer ke Vercel Blob
// lalu menyimpan URL publiknya di req.fileUrl
export const uploadToBlob = async (req, res, next) => {
  try {
    if (!req.file) return next();

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not set");
    }

    // nama file aman
    const safeName = (req.file.originalname || "file")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    const objectName = `images/${Date.now()}-${safeName}`;

    const { url } = await put(objectName, req.file.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: req.file.mimetype,
      cacheControl: "public, max-age=31536000, immutable", // cache CDN
    });

    req.fileUrl = url; // dipakai di controller
    next();
  } catch (err) {
    console.error("uploadToBlob error:", err);
    res.status(500).json({ message: "Upload gagal" });
  }
};

// OPTIONAL: alias agar import lama `makeUploadToBlob` tetap jalan
export const makeUploadToBlob = uploadToBlob;

export default upload;
