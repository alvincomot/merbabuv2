'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('reservasi', {
      // Kolom: id
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      // Kolom: judul
      judul: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Kolom: deskripsi_singkat
      deskripsi_singkat: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Kolom: image
      image: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Kolom: nomor_whatsapp
      nomor_whatsapp: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Kolom: pesan_whatsapp
      pesan_whatsapp: {
        type: Sequelize.TEXT, // Menggunakan TEXT karena tipe datanya text
        allowNull: false
      },
      // Kolom: createdAt
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      // Kolom: updatedAt
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('reservasi');
  }
};
