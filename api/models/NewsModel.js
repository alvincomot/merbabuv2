import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

let News;

if (process.env.NODE_ENV !== "production") {
  const { DataTypes } = await import("sequelize");
  News = db.define('news',{
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: { notEmpty: true },
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    konten: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(News);
News.belongsTo(Users, { foreignKey: "userId" });

} else {
  // Prisma (PostgreSQL)
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  
  News = prisma.news; // Prisma sudah auto-mapping ke table
}

export default News;
