import { Router } from 'express';

import blogOppRoutes from './modules/blogOperations/blogOpp.route.js';
import blogRoutes from './modules/blogs/blog.route.js';
import commentRoutes from './modules/comments/comments.route.js';
import commonRoutes from './modules/common/common.route.js';
import userRoutes from './modules/users/user.route.js';
// import analyticsRoutes from './modules/analytics/analytics.route.js'

const router = Router();

//router.use('/analytics', analyticsRoutes); // <- If analyticsRoutes was defined
router.use('/blog-operation', blogOppRoutes);
router.use('/blog', blogRoutes);
router.use('/comment', commentRoutes);
router.use('/common', commonRoutes);
router.use('/user', userRoutes);

router.get('/user', ((req, res) => {
  res.status(200).json({ msg: "welcome home" })
}));
router.get('/', ((req, res) => {
  res.status(200).json({ msg: "welcome home" })
}));

export default router;

