import Destinations from "../models/DestinationsModel.js";
import User from "../models/UserModel.js";
import path from "path";
import fs from "fs/promises";

export const getDestinations = async (req, res) => {
  try {
    const response = await Destinations.findAll({
      attributes: ["uuid", "name", "description", "image", "location"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDestinationsById = async (req, res) => {
  try {
    const destination = await Destinations.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!destination)
      return res.status(404).json({ message: "Destination not found" });

    let response;
    if (req.role === "admin") {
      response = await Destinations.findOne({
        where: {
          id: destination.id,
        },
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDestinations = async (req, res) => {
  const { name, description, location } = req.body;

  if (!req.file) {
    return res
      .status(400)
      .json({ message: "Tidak ada file gambar yang diunggah." });
  }
  const fileName = req.file.filename;
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    const newDestination = await Destinations.create({
      name: name,
      description: description,
      image: imageUrl,
      location: location,
    });

    res.status(201).json({
      message: "Destinasi berhasil dibuat",
      destination: newDestination,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDestinations = async (req, res) => {
  try {
    const destination = await Destinations.findOne({
      where: { uuid: req.params.id },
    });
    if (!destination)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    let imageUrl = destination.image;
    if (req.file) {
      console.log("Gambar baru terdeteksi. Mengganti file gambar...");

      if (req.file && destination.image) {
        try {
          const oldImageName = path.basename(destination.image);
          const oldImagePath = path.join("public/images", oldImageName);

          await fs.unlink(oldImagePath);
          console.log("Gambar lama berhasil dihapus:", oldImagePath);
        } catch (error) {
          if (error.code !== "ENOENT") {
            console.error(
              "Gagal menghapus gambar lama, tapi proses lanjut:",
              error
            );
          }
        }
      }

      // generate url baru untuk gambar yang diupload
      const newFileName = req.file.filename;
      imageUrl = `${req.protocol}://${req.get("host")}/images/${newFileName}`;
    }

    const { name, description, location } = req.body;
    await destination.update({
      name: name,
      description: description,
      location: location,
      image: imageUrl,
    });

    res.status(200).json({
      message: "Destinasi berhasil diperbarui",
      destination: destination,
    });
  } catch (error) {
    console.error("Error saat update destinasi:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

export const deleteDestinations = async (req, res) => {
  try {
    const destination = await Destinations.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    if (req.role === "admin") {
      if (destination.image) {
        const imageName = path.basename(destination.image);
        const imagePath = path.join('public/images', imageName);
        try {
          await fs.unlink(imagePath);
          console.log(`Gambar berhasil dihapus: ${imageName}`);
        } catch (error) {
          if (error.code !== 'ENOENT') {
            console.error("Gagal hapus gambar, tapi proses lanjut:", error);
          }
        }
      }

      await Destinations.destroy({
        where: {
          id: destination.id,
        },
      });

      return res.status(200).json({ message: "Destination deleted successfully" });
    } else {
      return res.status(403).json({ message: "Akses ditolak, Anda tidak memiliki izin" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
