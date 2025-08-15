// api/index.js (Prisma-ready)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../config/prisma.js";
import UserRoute from "../routes/UserRoute.js";
import DestinationsRoute from "../routes/DestinationsRoute.js";
import AuthRoute from "../routes/AuthRoute.js";
import NewsRoute from "../routes/NewsRoute.js";
import ReservasiRoute from "../routes/ReservasiRoute.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:5173",
  "https://merbabuv2.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/users", UserRoute);
app.use("/api/destinations", DestinationsRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/news", NewsRoute);
app.use("/api/reservasi", ReservasiRoute);

// Connect DB (Prisma)
prisma.$connect()
  .then(() => console.log("✅ Connected to database with Prisma"))
  .catch(err => console.error("❌ Unable to connect to database:", err));

export default app;
