import { Request, Response } from 'express';
import { blogCollection } from '../blogs/blog.model.js';
import { userCollection } from '../users/user.model.js';
import {Types} from 'mongoose';

const likeBlog = async (req: Request, res: Response) => {
    try{
        const blogid = req.params.blogId;
        console.log(blogid);
        const blogId = new Types.ObjectId(blogid as string);
        console.log('blog******************id',blogId);
        const blog = await blogCollection.findOne({_id:blogId});
           
        if(!blog){
            res.status(404).json({message:'blog not found'});
            return
        }
        blog.likes.push(req.userId!);
        blog.likesCount = (blog.likesCount as number) + 1;
        if ((blog.likes.length) > 10) {
          blog.likes.shift();
        }
        await blog.save();

        const user = await userCollection.findById(req.userId!);
        //if liked by user before then unlike it
        const liked = user!.likedBlogs.indexOf(blogId);
        if(liked !== -1){
            user!.likedBlogs.splice(liked,1)
            user!.save();
            res.status(200).json({message:'unlike successful'});
            return
            
        }else{
            user!.likedBlogs.push(blogId);
        }
        await user!.save();
        res.status(200).json({message:'liked successfully'});
        return
    }catch(err){
        console.log('err on like blog request ',err);
        res.status(500).json({message:'internal server error'});
        return
    }
 };
const saveBlog = async (req: Request, res: Response) => {
  try {
    const blogid = req.params.blogId;
    const blogId = new Types.ObjectId(blogid);

    const blog = await blogCollection.findById(blogId);
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return
    }

    const user = await userCollection.findById(req.userId!);
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return
    }

    const savedIndex = user.savedBlogs.findIndex(
      (id) => id.toString() === blogId.toString()
    );

    if (savedIndex !== -1) {
      user.savedBlogs.splice(savedIndex, 1);
      blog.saves = blog.saves as number - 1;
      await user.save();
      await blog.save();
      res.status(200).json({ message: 'Blog unsaved successfully' });
      return
    } else {
      // Not saved , then Save it
      user.savedBlogs.push(blogId);
      blog.saves = blog.saves as number + 1;
      await user.save();
      await blog.save();
      res.status(200).json({ message: 'Blog saved successfully' });
      return 
    }
  } catch (err) {
    console.error('Error on save blog request:', err);
    res.status(500).json({ message: 'Internal server error' });
    return
  }
};

const deleteBlog = async (req: Request, res: Response) => {
    try{
        const {blogId:blogid} = req.params;
        const blogId = new Types.ObjectId(blogid as string);
        if(!blogId){
            res.status(404).json({message:'blogId missing '});
            return
        }
        console.log('recieved blogggg id',blogId);
        const blog = await blogCollection.findByIdAndDelete(blogId);
        if(!blog){
            res.status(404).json({message:'blog does not exist any more '});
            return
        }
        const user = await userCollection.findById(req.userId!);
        const owner = user?.myBlogs.includes(blogId);
        if(!owner){
            res.status(401).json({message:'unauthorized'});
            return
        }
        if(user){
            const updated =  user?.myBlogs.filter(blog => blog != blogId);
            user.myBlogs = updated;
            await user?.save();
        }

        res.status(200).json({msg:'blog saved'});
        return 
    }catch(err){
        res.status(500).json({message:'internal server error'});
        return
    }
 };

export { likeBlog, saveBlog, deleteBlog }
