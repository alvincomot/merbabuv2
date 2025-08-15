import multer from "multer";
import { put } from "@vercel/blob";

// simpan file di memori dulu
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 35 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /png|jpg|jpeg/i.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Hanya png/jpg/jpeg"));
  },
});

export const uploadToBlob = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const objectName = `images/${Date.now()}-${(req.file.originalname || "file").replace(/\s+/g,"_")}`;

    const { url } = await put(objectName, req.file.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: req.file.mimetype,
    });

    req.fileUrl = url;
    next();
  } catch (err) {
    console.error("uploadToBlob error:", err);
    res.status(500).json({ message: "Upload gagal" });
  }
};
