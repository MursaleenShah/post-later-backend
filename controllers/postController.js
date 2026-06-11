const Post = require('../models/postModel');
const User = require('../models/userModel')
const {cloudinary} = require('../config/cloudinaryConnection')

exports.createPost =  async (req, res) => {
  try {
    const { title, content, scheduledTime } = req.body;
    const userId = req.user.userId; // Make sure to get userId from token (auth middleware)
     const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(401).json({ message: 'User does not exist. Unauthorized.' });
    }

    let mediaUrls = [];
    if(req.files && req.files.length >0){
        mediaUrls = req.files.map((file)=>file.path);
    }
    const newPost = await Post.create({
      userId,
      title,
      content,
      mediaUrls,
      scheduledTime,
    });
    console.log(scheduledTime)
    res.status(201).json({ message: 'Post created', post: newPost });
  } catch (err) {
    res.status(500).json({ message: 'Post creation failed', error: err.message });
  }
}




exports.getAllPosts = async (req , res) => {
  try {
    const userId = req.user.userId;
    const posts = await Post.find({userId});
    res.status(200).json({ success: true, posts }); 
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch posts', error: error.message });
  }
}

exports.deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.id;

    const post = await Post.findOne({ _id: postId, userId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Delete each media file from Cloudinary
    const deletePromises = post.mediaUrls.map(async (url) => {
      const publicId = url.split('/').pop().split('.')[0]; // assumes filename is public_id
      return await cloudinary.uploader.destroy(`post_scheduler_media/${publicId}`);
    });
    await Promise.all(deletePromises);

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post', error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.id;
    const { title, content, scheduledTime } = req.body;
    console.log('Post ID:', postId);
    console.log('User ID from token:', userId);


    // Step 1: Find the post
    const post = await Post.findOne({ _id: postId, userId });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Step 2: Delete old media from Cloudinary if new media is uploaded
    let updatedMediaUrls = post.mediaUrls;
    if (req.files && req.files.length > 0) {
      const deletePromises = post.mediaUrls.map(async (url) => {
        const publicId = url.split('/').pop().split('.')[0]; // assumes filename is public_id
        return await cloudinary.uploader.destroy(`post_scheduler_media/${publicId}`);
      });
      await Promise.all(deletePromises);

      // Step 3: Add new media URLs
      updatedMediaUrls = req.files.map((file) => file.path);
    }

    // Step 4: Update the post
    post.title = title;
    post.content = content;
    post.scheduledTime = scheduledTime;
    post.mediaUrls = updatedMediaUrls;
    post.status = 'pending';

    const updatedPost = await post.save();

    res.status(200).json({ message: 'Post updated', post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: 'Post update failed', error: err.message });
  }
};

// controllers/postController.js
exports.getPostById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.id;
    const post = await Post.findById( {_id:postId,userId});

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
