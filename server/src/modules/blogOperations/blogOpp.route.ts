import { Router } from 'express';
import { likeBlog, saveBlog, deleteBlog } from './blogOpp.controller.js';
import userAuth from '../middleware/userAuth.js';

const router = Router();

router.post('/like/:blogId',userAuth, likeBlog);
router.post('/save/:blogId',userAuth, saveBlog);
router.delete('/delete/:blogId',userAuth, deleteBlog);

export default router;
