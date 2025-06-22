import Destinations from "../models/DestinationsModel.js";
import User from "../models/UserModel.js";
import path from 'path';
import fs from 'fs';

export const getDestinations = async(req, res) => {
    try {
        const response = await Destinations.findAll({
            attributes: ['uuid', 'name', 'description', 'image', 'location']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getDestinationsById = async(req, res) => {
    try {
        const destination = await Destinations.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!destination) return res.status(404).json({ message: "Destination not found" });

        let response;
        if(req.role === 'admin') {
            response = await Destinations.findOne({
                where: {
                    id: destination.id
                }
            });
        }    
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createDestinations = async(req, res) => {
    const { name, description, location } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "Tidak ada file gambar yang diunggah." });
    }
    const fileName = req.file.filename;
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        const newDestination = await Destinations.create({
            name: name,
            description: description,
            image: imageUrl, // Pastikan nama kolom di model Anda adalah 'image'
            location: location
        });

        res.status(201).json({ 
            message: "Destinasi berhasil dibuat",
            destination: newDestination // Kirim objek destinasi baru
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateDestinations = async (req, res) => {
    try {
        // 1. Cari data destinasi yang akan di-edit
        const destination = await Destinations.findOne({
            where: { uuid: req.params.id }
        });
        if (!destination) return res.status(404).json({ message: "Data tidak ditemukan" });

        // 2. Siapkan variabel untuk URL gambar, defaultnya adalah URL gambar yang sudah ada
        let imageUrl = destination.image; 

        // 3. Cek jika ada file gambar BARU yang di-upload oleh admin
        if (req.file) {
            console.log("Gambar baru terdeteksi. Mengganti file gambar...");

            // HAPUS FILE GAMBAR LAMA dari folder server untuk menghemat ruang
            if (destination.image) {
                try {
                    // Ambil nama file dari URL lama
                    const oldImageName = destination.image.split('/images/')[1];
                    const oldImagePath = path.join('public/images', oldImageName);
                    
                    // Cek jika file lama ada, lalu hapus
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                        console.log("Gambar lama berhasil dihapus:", oldImagePath);
                    }
                } catch(err) {
                    console.error("Gagal menghapus gambar lama:", err);
                }
            }
            
            // 4. Buat URL untuk gambar BARU yang diupload oleh Multer (tanpa proses sharp)
            const newFileName = req.file.filename;
            imageUrl = `${req.protocol}://${req.get("host")}/images/${newFileName}`;
        }

        // 5. Ambil data teks dari body request
        const { name, description, location } = req.body;

        // 6. Lakukan update ke database dengan URL gambar yang sudah final
        await destination.update({
            name: name,
            description: description,
            location: location,
            image: imageUrl // Simpan URL gambar yang final (bisa yang baru, bisa yang lama)
        });

        res.status(200).json({
            message: "Destinasi berhasil diperbarui",
            destination: destination // Kirim kembali data yang sudah terupdate
        });

    } catch (error) {
        console.error("Error saat update destinasi:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

export const deleteDestinations = async(req, res) => {
    try {
        const destination = await Destinations.findOne({
            where: {
              uuid: req.params.id
            }
        });
        if (!destination) return res.status(404).json({ message: "Destination not found" });

        if(req.role === 'admin') {
            await Destinations.destroy({
                where: {
                  id: destination.id
                }
            })
        }    
        res.status(200).json({ message: "Destination deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}