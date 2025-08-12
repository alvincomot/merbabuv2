import User from "../models/UserModel.js"
import argon2 from "argon2";

export const getUsers = async(req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'role', 'createdAt']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserById = async(req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createUser = async(req, res) => {
    const {name, email, password, confirmPassword, role} = req.body;
    if (password !== confirmPassword) return res.status(400).json({ message: "Password dan Konfirmasi Password tidak cocok" });
    const hashPassword = await argon2.hash(password);
    try {
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        
        res.status(201).json({ 
            message: "User berhasil dibuat",
            user: newUser
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateUser = async(req, res) => {
    const user = await User.findOne({
      where: {
          uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const { name, email, password, confirmPassword, role } = req.body;
    let hashPassword;

    if (password && password.length > 0) {
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password dan Konfirmasi Password tidak cocok" });
        }
        hashPassword = await argon2.hash(password);
    } else {
        hashPassword = user.password;
    }
    
    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where: {
              id: user.id
            }
        });

        const updatedUser = await User.findByPk(user.id, {
            attributes: ['uuid', 'name', 'email', 'role', 'createdAt', 'updatedAt']
        });
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteUser = async(req, res) => {
    const user = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });
    if (!user) return res.status(404).json({ message: "User not found" });
    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}