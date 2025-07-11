import express from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/UserController.js";
import { verifyUser, adminOnly } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/users',verifyUser, adminOnly, getUsers);
router.get('/users/:id',verifyUser, adminOnly, getUserById);
router.post('/users',express.json(),verifyUser, adminOnly, createUser);
router.patch('/users/:id',express.json(),verifyUser, adminOnly, updateUser);
router.delete('/users/:id',verifyUser, adminOnly, deleteUser);

export default router;