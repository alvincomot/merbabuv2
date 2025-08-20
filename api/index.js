// /api/index.js
import express from "express";
import serverless from "serverless-http";
import { withTimeout } from "./utils/withTimeout.js";
import cors from "cors";
import session from "express-session";
import prisma from "../server/config/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import dotenv from "dotenv";
dotenv.config();

// routes
import UserRoute from "../server/routes/UserRoute.js";
import DestinationsRoute from "../server/routes/DestinationsRoute.js";
import AuthRoute from "../server/routes/AuthRoute.js";
import NewsRoute from "../server/routes/NewsRoute.js";
import ReservasiRoute from "../server/routes/ReservasiRoute.js";

const app = express();

// ------ CORS ------
const allowedOrigins = [
  "https://merbabuv2.vercel.app",
];
const isAllowed = (origin) =>
  !origin ||
  allowedOrigins.includes(origin) ||
  /^https:\/\/.+\.vercel\.app$/i.test(origin);

app.use(
  cors({
    origin: (origin, cb) =>
      isAllowed(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS")),
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// ------ Prisma connect (opsional, kamu sudah handle di module prisma.js) ------
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database with Prisma");
  } catch (err) {
    console.error("❌ Failed to connect database:", err);
  }
})();

app.set("trust proxy", 1);

// ------ SESSION ------
app.use(
  session({
    name: "sid",
    secret: process.env.SESS_SECRET || "prod-secret",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true,        // Vercel = https
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  })
);

// ------ ROUTES (pakai prefix /api) ------
app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/destinations", DestinationsRoute);
app.use("/api/reservasi", ReservasiRoute);
app.use("/api/news", NewsRoute);

// ------ HEALTH ------
app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});
app.get("/api/dbcheck", async (req, res) => {
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, 5000, "dbcheck");
    res.json({ db: "ok" });
  } catch (e) {
    res.status(500).json({ db: "fail", error: String(e?.message || e) });
  }
});

// note: tidak perlu serve static dari sini; biarkan Vite handle
export default serverless(app);
