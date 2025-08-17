// api/index.js (bersih, siap untuk Vercel)
import express from "express";
import serverless from "serverless-http";
import { withTimeout } from "./utils/withTimeout.js";
import cors from "cors";
import session from "express-session";
import prisma from "./config/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// routes
import UserRoute from "./routes/UserRoute.js";
import DestinationsRoute from "./routes/DestinationsRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import NewsRoute from "./routes/NewsRoute.js";
import ReservasiRoute from "./routes/ReservasiRoute.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "https://merbabuv2.vercel.app",
  // tambahkan origin lain jika perlu (misalnya preview deployment Vercel)
];

const isAllowed = (origin) => {
  if (!origin) return true; // same-origin / server-to-server
  if (allowedOrigins.includes(origin)) return true;
  // allow preview deployments: https://*.vercel.app
  if (/^https:\/\/.+\.vercel\.app$/i.test(origin)) return true;
  return false;
};

// CORS
app.use(cors({
  origin: (origin, cb) =>
    isAllowed(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS")),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ====== Prisma connect (production only) ======
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database with Prisma");
  } catch (err) {
    console.error("❌ Failed to connect database:", err);
  }
})();

app.set("trust proxy", 1);

// ====== SESSION ======
app.use(
  session({
    name: "sid",
    secret: process.env.SESS_SECRET || "prod-secret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true, // wajib di Vercel (https)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // bersihkan session expired tiap 2 menit
      dbRecordIdIsSessionId: true,
    }),
  })
);

// ====== ROUTES ======
app.use("/auth", AuthRoute);
app.use("/users", UserRoute);
app.use("/destinations", DestinationsRoute);
app.use("/reservasi", ReservasiRoute);
app.use("/news", NewsRoute);

// ====== HEALTH CHECK ======
app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.get("/api/dbcheck", async (req, res) => {
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, 5000, "dbcheck");
    res.json({ db: "ok" });
  } catch (e) {
    console.error("dbcheck failed:", e);
    res.status(500).json({ db: "fail", error: String(e?.message || e) });
  }
});

export default serverless(app);
