import { Request, Response } from 'express';
import {blogCollection} from './blog.model.js';
import {userCollection} from '../users/user.model.js' ;

const getBlogs = async (req: Request, res: Response) => {
};
const refreshBlogs = async (req: Request, res: Response) => { };

const postBlog = async (req: Request, res: Response) => {
    try {
        const { title, content, topics, isDraft } = req.body;
        
        if (!title || !content) {
            res.status(400).json({ message: 'Missing required fields: title and content' });
            return;
        }

        const user = await userCollection.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (user.blogPostLimit.limit === 0) {
            const nowTime = Date.now(); 
            const timeDiff = nowTime - user.blogPostLimit.startTime.getTime(); //convert Date to timestamp
            const sixHoursInMs = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
            
            if (timeDiff < sixHoursInMs) {
                const limitExpiresAt = user.blogPostLimit.startTime.getTime() + sixHoursInMs;
                res.status(429).json({ 
                    message: 'You have reached your max blog post limit', 
                    limitExpiresAt: limitExpiresAt 
                });
                return;
            }
            // Reset limit after 6 hours
            user.blogPostLimit.limit = 5;
            user.blogPostLimit.startTime = new Date(); // Fixed: removed '.now()'
        }

        // Create blog post
        const blog = await blogCollection.create({
            title: title,
            content: content,
            topics: topics || [],
            isDraft: isDraft || false,
        });

        // Handle draft vs published blog
        if (isDraft) {
            user.drafts.push(blog._id);
        } else {
            user.myBlogs.push(blog._id);
        }

        // Decrement blog post limit
        user.blogPostLimit.limit -= 1;

        // Save user changes
        await user.save();

        res.status(201).json({ 
            message: 'Blog created successfully', 
            blogId: blog._id,
            isDraft: isDraft || false
        });
        return;

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
        console.log('Create blog request error: ', err);
        return;
    }
};

const myBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const user = await userCollection.findById(req.userId).populate({
      path: 'myBlogs',
      select: '-isDraft -__v'
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return
    }

    const sorted = (user.myBlogs as any[]).sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt).getTime();
      return timeB - timeA;
    });

    const paginated = sorted.slice((page - 1) * limit, page * limit);

    res.status(200).json({ myBlogs: paginated });
    return 
  } catch (err) {
    console.error('myBlogs request error:', err);
    res.status(500).json({ message: 'Internal server error' });
    return 
  }
};


const savedBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const user = await userCollection.findById(req.userId).populate({
      path: 'savedBlogs',
      select: '-isDraft -__v'
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return
    }

    const sorted = (user.savedBlogs as any[]).sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt).getTime();
      return timeB - timeA; // Descending
    });

    const paginated = sorted.slice((page - 1) * limit, page * limit);

    res.status(200).json({ savedBlogs: paginated });
    return
  } catch (err) {
    console.error('savedBlogs request error:', err);
    res.status(500).json({ message: 'Internal server error' });
    return
  }
};


const likedBlogs = async (req: Request, res: Response) => {
  try {
    const likedBlogs = await userCollection.aggregate([
      { $match: { _id: req.userId } },
      {
        $lookup: {
          from: "blogs",               
          localField: "likedBlogs",
          foreignField: "_id",
          as: "likedBlogDetails"
        }
      },
      {
        $project: {
          likedBlogDetails: {
            title: 1,
            content: 1,
            views: 1,
            likes: 1,
            comments: 1,
            topics: 1,
            shareCount: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      }
    ]);

    res.status(200).json({ likedBlogs: likedBlogs[0]?.likedBlogDetails || [] });
    return
  } catch (err) {
    console.error('likedBlogs request error:', err);
    res.status(500).json({ message: 'internal server error' });
    return
  }
};


export { getBlogs, refreshBlogs, myBlogs, postBlog, savedBlogs, likedBlogs };
