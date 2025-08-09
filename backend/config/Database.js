// File: backend/config/Database.js
import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

let db;

// Cek jika sedang dalam lingkungan produksi
if (process.env.NODE_ENV === 'production') {
  // Blok untuk Produksi (Postgres)
  db = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Blok untuk Development Lokal (MySQL)
  db = new Sequelize(process.env.DATABASE_URL_NON_POOLING, {
    dialect: 'mysql' // Secara eksplisit gunakan dialek MySQL untuk lokal
  });
}

export default db;