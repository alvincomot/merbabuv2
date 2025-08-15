import db from "../config/Database.js";

let Users;

if (process.env.NODE_ENV !== "production") {
  const { DataTypes } = await import("sequelize");
  Users = db.define('users', {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: { notEmpty: true }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [3, 100] }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    }
  }, {
    freezeTableName: true,
  });

} else {
  // Prisma (PostgreSQL)
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  
  Users = prisma.users; // Prisma sudah auto-mapping ke table
}

export default Users;
