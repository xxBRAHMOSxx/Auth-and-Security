import express from 'express';
import { signup, login, logout, getUser, deleteUser } from '../controllers/auth.controller.js';


const router = express.Router();

router.get('/user', getUser);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/delete', deleteUser);

export default router;