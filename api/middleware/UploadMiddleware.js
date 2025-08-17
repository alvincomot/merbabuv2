import multer from "multer";
import { put } from "@vercel/blob";

// Simpan file di memori agar dapat diunggah ke Vercel Blob
const storage = multer.memoryStorage();
const upload = multer({ storage });
export { upload };

// Buat middleware untuk mengunggah file ke Blob dan menyimpan URL publiknya
export const makeUploadToBlob = (folder = "uploads") => async (req, res, next) => {
  if (!req.file) return next();
  try {
    const filename = `${folder}/${Date.now()}-${req.file.originalname}`;
    const { url } = await put(filename, req.file.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    req.fileUrl = url;
    next();
  } catch (err) {
    console.error("uploadToBlob error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// Middleware default dengan folder umum
export const uploadToBlob = makeUploadToBlob();

export default upload;
