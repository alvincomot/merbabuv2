import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "./config/prisma.js";
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

const dbClient = await (async () => {
  if (process.env.NODE_ENV === 'production') {
    console.log("Running in production with PostgreSQL + Prisma");
    const { default: prisma } = await import('./config/prisma.js');
    return prisma;
  } else {
    console.log("Running in development with MySQL + Sequelize");
    const { default: sequelize } = await import('./config/config.js');
    try {
      await sequelize.authenticate();
      console.log('MySQL connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the MySQL database:', error);
    }
    return sequelize;
  }
})();

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

console.log("📦 Connect DB (Prisma)");

prisma.$connect()
  .then(() => console.log("✅ Connected to database with Prisma"))
  .catch(err => console.error("❌ Unable to connect to database:", err));

  app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export default app;
