// api/config/config.js
import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
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
};
