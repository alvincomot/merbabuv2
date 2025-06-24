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

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(UserRoute);
app.use(DestinationsRoute);
app.use(AuthRoute);
app.use(NewsRoute);
app.use(ReservasiRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...");
});
