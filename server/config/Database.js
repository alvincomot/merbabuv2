// api/config/Database.js
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

/**
 * Singleton pattern untuk Prisma di serverless (Vercel).
 */
const globalForPrisma = globalThis;

const db =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log:
      process.env.PRISMA_LOG === "true"
        ? ["query", "error", "warn"]
        : ["error", "warn"],
  });

// Simpan di global supaya tidak buat instance baru tiap invoke
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = db;
}

export default db;
