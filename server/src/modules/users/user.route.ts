import { Router } from 'express';
import { signup, login, logout } from './user.controller.js';
import userAuth from '../middleware/userAuth.js';

const router = Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',userAuth,logout);

export default router;
