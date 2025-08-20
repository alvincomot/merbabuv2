// api/config/config.js
import dotenv from "dotenv";
dotenv.config();

/**
 * Satu-satunya sumber kebenaran untuk config aplikasi.
 * Tidak ada lagi opsi Sequelize/MySQL.
 */
export const appConfig = {
  nodeEnv: process.env.NODE_ENV || "production",

  // Selalu Prisma
  dbClient: "prisma",

  // URL DB yang dipakai Prisma
  databaseUrl: process.env.POSTGRES_URL,

  // Origins yang diizinkan CORS, pisahkan dengan koma jika lebih dari satu
  cors: {
    allowedOrigins: (process.env.CORS_ORIGINS || "https://merbabuv2.vercel.app")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  },

  // Session
  session: {
    secret: process.env.SESS_SECRET || "change-me",
    cookieName: process.env.SESS_NAME || "sid",
  },

  // Guard timeout (ms) untuk query/HTTP internal
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS || 8000),
};
