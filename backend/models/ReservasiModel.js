import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const LayananReservasi = db.define('reservasi', {
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

export default LayananReservasi;