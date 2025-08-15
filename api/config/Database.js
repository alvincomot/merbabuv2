import { appConfig } from "./config.js";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let dbClientInstance;

if (appConfig.dbClient === "sequelize") {
  console.log("📦 Using Sequelize as DB client");

  let sequelize;
  if (process.env.NODE_ENV === "production") {
    sequelize = new Sequelize(process.env.POSTGRES_URL, {
      dialect: "postgres",
      protocol: "postgres",
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
    });
  } else {
    sequelize = new Sequelize(
      process.env.DB_NAME || "db_merbabuv2",
      process.env.DB_USER || "root",
      process.env.DB_PASS || null,
      {
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: "mysql",
      }
    );
  }

  dbClientInstance = sequelize;

} else if (appConfig.dbClient === "prisma") {
  console.log("📦 Using Prisma as DB client");

  const { PrismaClient } = await import("@prisma/client");
  dbClientInstance = new PrismaClient();
}

export default dbClientInstance;
