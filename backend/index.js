// api/index.js (Vercel Serverless entry point)
import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../config/prisma.js"; // sesuaikan path untuk Vercel
import UserRoute from "../routes/UserRoute.js";
import DestinationsRoute from "../routes/DestinationsRoute.js";
import AuthRoute from "../routes/AuthRoute.js";
import NewsRoute from "../routes/NewsRoute.js";
import ReservasiRoute from "../routes/ReservasiRoute.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://merbabuv2.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Session setup
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    }
  })
);

// Static files (jika perlu)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/users", UserRoute);
app.use("/api/destinations", DestinationsRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/news", NewsRoute);
app.use("/api/reservasi", ReservasiRoute);

// Database connect (optional: bisa di middleware)
prisma.$connect()
  .then(() => console.log("✅ Connected to database with Prisma"))
  .catch(err => console.error("❌ Unable to connect to database:", err));

// Export untuk Vercel
export default app;
