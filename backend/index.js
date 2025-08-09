import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import DestinationsRoute from "./routes/DestinationsRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import NewsRoute from "./routes/NewsRoute.js"
import ReservasiRoute from "./routes/ReservasiRoute.js";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// (async () => {
//     await db.sync();
// })();

const allowedOrigins = [
  'http://localhost:5173',                      // Untuk development lokal
  'https://merbabuv2.vercel.app'                 // Untuk production di Vercel
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(UserRoute);
app.use(DestinationsRoute);
app.use(AuthRoute);
app.use(NewsRoute);
app.use(ReservasiRoute);

// store.sync();

// app.listen(process.env.APP_PORT, () => {
//   console.log("Server up and running...");
// });

const startServer = async () => {
  try {
    // Coba autentikasi ke database
    await db.authenticate();
    console.log('✅ Connection to database has been established successfully.');

    // Jika koneksi berhasil, baru jalankan server
    app.listen(3000, () => console.log('🚀 Server running on port 3000'));

  } catch (error) {
    // Jika koneksi gagal, tampilkan error yang jelas
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Panggil fungsi untuk memulai server
startServer();
