import { Sequelize } from "sequelize";
import db from "../config/Database.js";

let LayananReservasi;


if (process.env.NODE_ENV !== "production") {
  const { DataTypes } = await import("sequelize");
  LayananReservasi = db.define('reservasi', {
    judul: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deskripsi_singkat: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nomor_whatsapp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pesan_whatsapp: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    freezeTableName: true
});

} else {
  // Prisma (PostgreSQL)
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  
  LayananReservasi = prisma.reservasi; // Prisma sudah auto-mapping ke table
}

export default LayananReservasi;