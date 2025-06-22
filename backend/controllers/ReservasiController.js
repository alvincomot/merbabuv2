// file: backend/controllers/ReservasiController.js

import LayananReservasi from "../models/ReservasiModel.js";
import path from 'path';
import fs from 'fs';

// GET semua layanan reservasi (Publik)
export const getLayananReservasi = async (req, res) => {
    try {
        const response = await LayananReservasi.findAll({
            order: [['id', 'ASC']] // Urutkan berdasarkan ID
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE layanan reservasi baru (Admin)
export const createLayananReservasi = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "File gambar wajib diunggah." });
    }
    
    const { judul, deskripsi_singkat, nomor_whatsapp, pesan_whatsapp } = req.body;
    const fileName = req.file.filename;
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        const newLayanan = await LayananReservasi.create({
            judul,
            deskripsi_singkat,
            image: imageUrl,
            nomor_whatsapp,
            pesan_whatsapp
        });
        res.status(201).json({ message: "Layanan Reservasi berhasil dibuat", layanan: newLayanan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ UPDATE layanan reservasi (Admin)
export const updateLayananReservasi = async (req, res) => {
    try {
        const layanan = await LayananReservasi.findByPk(req.params.id);
        if (!layanan) return res.status(404).json({ message: "Layanan tidak ditemukan" });

        let imageUrl = layanan.image;
        // Cek jika ada file gambar baru yang diunggah
        if (req.file) {
            // Hapus gambar lama jika ada
            if (layanan.image) {
                const oldImageName = layanan.image.split('/images/')[1];
                const oldImagePath = path.join('public/images', oldImageName);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            // Atur URL untuk gambar baru
            imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        }

        const { judul, deskripsi_singkat, nomor_whatsapp, pesan_whatsapp } = req.body;

        await layanan.update({
            judul,
            deskripsi_singkat,
            image: imageUrl,
            nomor_whatsapp,
            pesan_whatsapp
        });

        res.status(200).json({ message: "Layanan Reservasi berhasil diperbarui", layanan: layanan });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ DELETE layanan reservasi (Admin)
export const deleteLayananReservasi = async (req, res) => {
    try {
        const layanan = await LayananReservasi.findByPk(req.params.id);
        if (!layanan) return res.status(404).json({ message: "Layanan tidak ditemukan" });

        // Hapus file gambar terkait dari server
        if (layanan.image) {
            const oldImageName = layanan.image.split('/images/')[1];
            const oldImagePath = path.join('public/images', oldImageName);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        await layanan.destroy();
        res.status(200).json({ message: "Layanan Reservasi berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};