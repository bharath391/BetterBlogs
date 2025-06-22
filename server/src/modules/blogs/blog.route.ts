import { Router } from 'express';
import { getBlogs, refreshBlogs, postBlog, myBlogs, savedBlogs, likedBlogs } from './blog.controller.js';
import userAuth from './../middleware/userAuth.js';

const router = Router();

router.get('/', userAuth,getBlogs);
router.get('/refresh-blogs', userAuth,refreshBlogs);
router.post('/post-blog', userAuth,postBlog);
router.get('/my-blogs', userAuth,myBlogs);
router.get('/saved-blogs', userAuth,savedBlogs);
router.get('/liked-blogs', userAuth,likedBlogs);

export default router;
