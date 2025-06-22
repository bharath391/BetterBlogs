import { Request, Response } from 'express';
import { blogCollection } from '../blogs/blog.model.js';
import { commentCollection } from './comments.model.js';
import {Types} from 'mongoose';
import { userCollection } from '../users/user.model.js';

const postComment = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const { content } = req.body;
        
        if (!blogId) {
            res.status(400).json({ message: 'Blog ID is missing' });
            return;
        }
        
        if (!content || content.trim().length === 0) {
            res.status(400).json({ message: 'Comment content cannot be empty' });
            return;
        }

        const user = await userCollection.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const blog = await blogCollection.findById(new Types.ObjectId(blogId));
        if (!blog) {
            res.status(404).json({ message: 'Blog not found' });
            return;
        }

        if (blog.isDraft) {
            res.status(400).json({ message: 'Cannot comment on draft blogs' });
            return;
        }

        // Check and handle comment post limit
        if (user.commentPostLimit.limit === 0) {
            const nowTime = Date.now();
            const timeDiff = nowTime - user.commentPostLimit.startTime.getTime();
            const oneHour =  60 * 60 * 1000; // 1 hours in milliseconds
            
            if (timeDiff < oneHour) {
                const limitExpiresAt = user.commentPostLimit.startTime.getTime() + oneHour;
                res.status(429).json({ 
                    message: 'You have reached your max comment limit', 
                    limitExpiresAt: limitExpiresAt 
                });
                return;
            }
            
            // Reset limit after 1 hours
            user.commentPostLimit.limit = 10; //10 comments per 1 hours
            user.commentPostLimit.startTime = new Date();
        }

        const comment = await commentCollection.create({
            content: content.trim(),
            userId: req.userId,
        });

        blog.comments.push(comment._id as Types.ObjectId);
        await blog.save();

        user.commentPostLimit.limit -= 1;
        await user.save();

        res.status(201).json({ 
            message: 'Comment posted successfully', 
            commentId: comment._id,
            comment: {
                id: comment._id,
                content: comment.content,
                createdAt: comment.createdAt
            }
        });
        return;

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
        console.log('Post comment request error: ', err);
        return;
    }
};


const updateComment = async (req: Request, res: Response) => {
    try{
        const {commentId} = req.params;
        const {content} = req.body;
        if(!commentId){
            res.status(400).json({message:'commentId missing'});
            return
        }
        const comment = await commentCollection.findById(new Types.ObjectId(commentId));
        console.log('comment from db ....',comment);
        if(!comment){
            res.status(404).json({message:'comment not found'});
            return
        }
        if(!comment.userId.equals(req.userId)){
            res.status(401).json({message:'unauthorized'});
            return
        }
        comment.content = content || "" ;
        res.status(200).json({message:'comment updated '});
        return
    }catch(err){
        res.status(500).json({message:'internal server error'});
        return
    }
}
const deleteComment = async (req: Request, res: Response) => {
    try{
        const {commentId} = req.params ;
        if(!commentId){
            res.status(400).json({message:'commentId missing'});
            return
        }
        const comment = await commentCollection.findByIdAndDelete(commentId);
        if(!comment){
            res.status(404).json({message:'comment not found'});
            return
        }
        if(!comment.userId.equals(req.userId!)){
            res.status(401).json({message:'un authorizes'});
            return
        }
        res.status(200).json({message:'comment deleted '});
        return
    }catch(err){
        res.status(500).json({message:'internal server error'});
        return
    }
}

export { postComment, updateComment, deleteComment };
