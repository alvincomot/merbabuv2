// api/config/Database.js
import dotenv from "dotenv";
dotenv.config();

let db;

if (process.env.NODE_ENV === "production") {
  console.log("📦 Using Prisma (PostgreSQL) as DB client");

  const { PrismaClient } = await import("@prisma/client");
  db = new PrismaClient();

} else {
  console.log("📦 Using Sequelize (MySQL) as DB client");

  const { Sequelize } = await import("sequelize");

  db = new Sequelize(
    process.env.DB_NAME || "db_merbabuv2",
    process.env.DB_USER || "root",
    process.env.DB_PASS || null,
    {
      host: process.env.DB_HOST || "127.0.0.1",
      dialect: "mysql",
    }
  );
}

export default db;
