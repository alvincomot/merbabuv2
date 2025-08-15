// api/index.js (rapi & siap Vercel)
import express from "express";
import cors from "cors";
import session from "express-session";
import prisma from "./config/prisma.js"; // pastikan path sesuai
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import UserRoute from "./routes/UserRoute.js";
import DestinationsRoute from "./routes/DestinationsRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import NewsRoute from "./routes/NewsRoute.js";
import ReservasiRoute from "./routes/ReservasiRoute.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = ["https://merbabuv2.vercel.app", "http://localhost:5173"];

app.use(cors({
  origin: (origin, cb) => (!origin || allowedOrigins.includes(origin)) ? cb(null, true) : cb(new Error("Not allowed by CORS")),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ==== DB connect (hybrid) ====
if (process.env.NODE_ENV === "production") {
  console.log("Running in production with PostgreSQL + Prisma");
  const { default: prisma } = await import("./config/prisma.js");
  await prisma.$connect();
  console.log("✅ Connected to database with Prisma");
} else {
  console.log("Running in development with MySQL + Sequelize");
  const { default: sequelize } = await import("./config/config.js"); // ini file koneksi Sequelize-mu
  await sequelize.authenticate();
  console.log("✅ MySQL connection has been established successfully.");
}

app.set("trust proxy", 1);

// ====== SESSION ======
app.use(
  session({
    name: "sid",                         // nama cookie
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,                       // Prisma store tidak butuh resave
    saveUninitialized: false,            // jangan buat session kosong
    proxy: true,                         // penting saat di belakang proxy (Vercel)
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // wajib true di Vercel (https)
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 hari
    },
    store: new PrismaSessionStore(prisma, {
      // cek & bersihkan session kadaluarsa tiap 2 menit
      checkPeriod: 2 * 60 * 1000,
      // pakai kolom 'sid' sebagai id
      dbRecordIdIsSessionId: true,
    }),
  })
);
// ====== END SESSION ======

app.use("/auth", AuthRoute);
app.use("/users", UserRoute);
app.use("/destinations", DestinationsRoute);
app.use("/reservasi", ReservasiRoute);
app.use("/news", NewsRoute);

export default app;
