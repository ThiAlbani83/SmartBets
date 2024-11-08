import express from 'express';
import { checkAuth, loginUser, logoutUser, registerUser, inviteUser } from '../controllers/auth.controller.js';
import { verificarToken } from '../middleware/verificarToken.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/check-auth', verificarToken, checkAuth);
router.post('/logout', logoutUser);
router.post("/invite", inviteUser);

export default router;