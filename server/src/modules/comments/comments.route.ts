import { Router } from 'express';
import { postComment, updateComment, deleteComment } from './comments.controller.js';
import userAuth from '../middleware/userAuth.js';
const router = Router();

router.post('/post-comment/:blogId',userAuth, postComment);
router.patch('/update-comment/:commentId',userAuth, updateComment);
router.delete('/delete-comment/:commentId', userAuth,deleteComment);

export default router;
  