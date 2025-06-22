import { Request, Response } from 'express';
import { Iblog, blogCollection } from '../blogs/blog.model.js';
import { userCollection } from '../users/user.model.js'; 

const getBlogs = async (req: Request, res: Response) => {
    try {
        const commonBlogs = await blogCollection.aggregate([
            {
                $match: { isDraft: false } // Only get published blogs
            },
            {
                $addFields: {
                    viewCount: { $size: "$views" },
                    likeCount: { $size: "$likes" },
                    commentCount: { $size: "$comments" }
                }
            },
            {
                $sort: { viewCount: -1 }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    topics: 1,
                    viewCount: 1,
                    likeCount: 1,
                    commentCount: 1,
                    saves: 1,
                    shareCount: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Popular blogs fetched successfully",
            data: commonBlogs
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching popular blogs",
            error: error instanceof Error ? error.message : "Unknown error"
        });
        return
    }
};

const refreshBlogs = async (req: Request, res: Response) => {
    try {
        // Get fresh blogs sorted by creation date (most recent first)
        const freshBlogs = await blogCollection.aggregate([
            {
                $match: { isDraft: false } // Only get published blogs
            },
            {
                $addFields: {
                    viewCount: { $size: "$views" },
                    likeCount: { $size: "$likes" },
                    commentCount: { $size: "$comments" }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 20
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    topics: 1,
                    viewCount: 1,
                    likeCount: 1,
                    commentCount: 1,
                    saves: 1,
                    shareCount: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Fresh blogs fetched successfully",
            data: freshBlogs
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching fresh blogs",
            error: error instanceof Error ? error.message : "Unknown error"
        });
        return
    }
};

const sharedBlog = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        
        if (!blogId) {
            res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
            return
        }

        // Find the blog and increment share count
        const blog = await blogCollection.findByIdAndUpdate(
            blogId,
            { $inc: { shareCount: 1 } },
            { new: true }
        ).select('-__v');

        if (!blog) {
           res.status(404).json({
                success: false,
                message: "Blog not found"
            });
            return
        }

        // Add view count, like count, and comment count
        const blogWithCounts = {
            ...blog.toObject(),
            viewCount: blog.views.length,
            likeCount: blog.likes.length,
            commentCount: blog.comments.length
        };

        res.status(200).json({
            success: true,
            message: "Blog shared successfully",
            data: blogWithCounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error sharing blog",
            error: error instanceof Error ? error.message : "Unknown error"
        });
        return
    }
};

const publicProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required"
            });
            return
        }

        // Get user's public profile information
        const user = await userCollection.findById(userId)
            .select('name bio profession country socialAccounts followers following myBlogs createdAt')
            .populate({
                path: 'myBlogs',
                match: { isDraft: false }, // Only show published blogs
                select: 'title content topics views likes comments saves shareCount createdAt updatedAt',
                options: { sort: { createdAt: -1 } }
            });

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return
        }

        // Calculate blog statistics
        const blogStats = {
            totalBlogs: user.myBlogs.length,
            totalFollowers: user.followers.length,
            totalFollowing: user.following.length,
            totalViews: user.myBlogs.reduce((acc: number, blog: any) => acc + blog.views.length, 0),
            totalLikes: user.myBlogs.reduce((acc: number, blog: any) => acc + blog.likes.length, 0)
        };

        // Format blogs with counts
        const blogsWithCounts = user.myBlogs.map((blog: any) => ({
            ...blog.toObject(),
            viewCount: blog.views.length,
            likeCount: blog.likes.length,
            commentCount: blog.comments.length
        }));

        const publicProfileData = {
            user: {
                _id: user._id,
                name: user.name,
                bio: user.bio,
                profession: user.profession,
                country: user.country,
                socialAccounts: user.socialAccounts,
                createdAt: user.createdAt
            },
            stats: blogStats,
            blogs: blogsWithCounts
        };

        res.status(200).json({
            success: true,
            message: "Public profile fetched successfully",
            data: publicProfileData
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching public profile",
            error: error instanceof Error ? error.message : "Unknown error"
        });
        return
    }
};

export { getBlogs, refreshBlogs, sharedBlog, publicProfile };