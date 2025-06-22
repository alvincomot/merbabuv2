import User from '../models/UserModel.js';
import argon2 from 'argon2';

export const register = async(req, res) => {
    // 1. Ambil data dari body request
    const { name, email, password, confPassword } = req.body;

    // 2. Lakukan validasi password
    if (password !== confPassword) {
        return res.status(400).json({ message: "Password dan Konfirmasi Password tidak cocok" });
    }

    // 3. Hash password sebelum disimpan
    const hashPassword = await argon2.hash(password);

    try {
        // 4. Simpan user baru ke database
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "user" // 5. Otomatis set peran sebagai 'user' untuk keamanan
        });
        
        // 6. Kirim respons sukses
        res.status(201).json({ message: "Registrasi berhasil, silakan login." });
    } catch (error) {
        // Tangani jika email sudah ada (error dari database) atau error lainnya
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Email sudah terdaftar." });
        }
        res.status(400).json({ message: error.message });
    }
}

export const login = async (req, res) => { 
    const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
    if (!user) return res.status(404).json({ message: "User not found" });
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    res.status(200).json({uuid, name, email, role});
}

export const Me = async (req, res) => {
    // 1. Periksa apakah session dan userId ada.
    if (!req.session || !req.session.userId) {
        // Jika tidak ada sesi, langsung kirim 401 Unauthorized.
        return res.status(401).json({ message: "Akses ditolak, silakan login." });
    }

    try {
        // 2. Cari user berdasarkan uuid yang tersimpan di sesi.
        const user = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'], // Ambil hanya data yang diperlukan
            where: {
                uuid: req.session.userId
            }
        });

        // 3. Jika user tidak ditemukan di database (misal: sudah dihapus)
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }
        
        // 4. Jika semua aman, kirim data user.
        res.status(200).json(user);

    } catch (error) {
        // 5. Tangani jika ada error database atau lainnya.
        console.error("Error di controller Me:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
}

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ message: "Failed to logout" });
        res.status(200).json({ message: "Logout successful" });
    });
}