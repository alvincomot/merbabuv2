import User from '../models/UserModel.js';
import argon2 from 'argon2';

export const register = async(req, res) => {
    const { name, email, password, confPassword } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ message: "Password dan Konfirmasi Password tidak cocok" });
    }

    const hashPassword = await argon2.hash(password);

    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "user"
        });
        
        res.status(201).json({ message: "Registrasi berhasil, silakan login." });
    } catch (error) {
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
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Akses ditolak, silakan login." });
    }

    try {
        const user = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.session.userId
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }
        
        res.status(200).json(user);

    } catch (error) {
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