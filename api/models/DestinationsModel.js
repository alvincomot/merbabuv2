import { Sequelize } from "sequelize";
import db from "../config/Database.js";

let Destinations;

if (process.env.NODE_ENV !== "production") {
  const { DataTypes } = await import("sequelize");
  Destinations = db.define('destination', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true,
});

} else {
  // Prisma (PostgreSQL)
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  
  Destinations = prisma.destination; // Prisma sudah auto-mapping ke table
}

export default Destinations;