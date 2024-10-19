import express from 'express';
import { signup, login, logout, getUser, deleteUser, verifyUser, forgotPassword } from '../controllers/auth.controller.js';


const router = express.Router();

router.get('/user', getUser);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/delete', deleteUser);

router.post('/verifyUser', verifyUser);
router.post('/forgotPassword', forgotPassword);

export default router;