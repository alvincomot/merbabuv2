import express from 'express';
import {login, logout, Me, register} from "../controllers/Auth.js"

const router = express.Router();

router.get('/me', Me);
router.post('/register', express.json(), register);
router.post('/login', express.json(), login);
router.delete('/logout', logout);

export default router;