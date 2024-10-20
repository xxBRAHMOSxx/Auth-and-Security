import express from 'express';
import {
    signup, login, logout,
    getUser, deleteUser, verifyUser,
    forgotPassword, resetPassword, checkAuth
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();

router.get('/checkAuth',verifyToken,checkAuth);

// router.get('/user', getUser);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/delete',verifyToken, deleteUser);

router.post('/verifyUser', verifyUser);
router.post('/forgotPassword', forgotPassword);

router.post('/resetpassword/:token', resetPassword);

export default router;