import express from 'express';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', authController.handleNewUser);
router.post('/login', authController.handleLogin);
router.get('/refreshtoken', authController.handleRefreshToken);
router.get('/logout', authController.handleLogout);

export default router