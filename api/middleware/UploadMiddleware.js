import multer from "multer";
import { put } from "@vercel/blob";

// Configure multer to store files in memory so they can be uploaded to Vercel Blob
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/**
 * Create middleware that uploads the file in `req.file` to Vercel Blob and
 * stores the resulting public URL in `req.fileUrl`.
 *
 * @param {string} prefix Optional path prefix inside the blob store.
 */
export const makeUploadToBlob = (prefix = "") => async (req, _res, next) => {
  if (!req.file) return next();

  try {
    const filename = prefix ? `${prefix}/${req.file.originalname}` : req.file.originalname;
    const { url } = await put(filename, req.file.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    req.fileUrl = url;
    return next();
  } catch (err) {
    console.error("uploadToBlob error:", err);
    return next(err);
  }
};

// Default middleware without prefix
export const uploadToBlob = makeUploadToBlob();
