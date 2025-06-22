import { Router } from 'express';
import { getBlogs, refreshBlogs, sharedBlog, publicProfile } from './common.controller.js';

const router = Router();


router.get('/blogs', getBlogs);
router.get('/refresh-blogs', refreshBlogs);
router.get('/shared/:blogId', sharedBlog);
router.get('/profile/:userId', publicProfile);

export default router;
