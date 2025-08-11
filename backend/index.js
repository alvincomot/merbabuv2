import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "./config/prisma.js"; // Prisma Client
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
  "http://localhost:5173",
  "https://merbabuv2.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Session — kalau mau simpan session di DB, bisa pakai prisma-session-store
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto"
    }
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(UserRoute);
app.use(DestinationsRoute);
app.use(AuthRoute);
app.use(NewsRoute);
app.use(ReservasiRoute);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database with Prisma");

    app.listen(3000, () => console.log("🚀 Server running on port 3000"));
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
  }
};

startServer();
