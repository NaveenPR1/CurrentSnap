// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { authenticate, requireMember } = require('../middleware/auth');
const { Post, Comment, User } = require('../models');

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create a new post (Admin & Member only)
router.post('/', authenticate, requireMember, upload.single('image'), async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    await Post.create({ title, image: imageUrl, userId });
    res.json({ message: 'Post created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all posts – public endpoint
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['created_at', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a post – members can delete only their own; admin can delete any
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (req.user.role !== 'admin' && req.user.id !== post.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like a post – public endpoint
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.likes += 1;
    await post.save();
    res.json({ message: 'Post liked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new comment on a post (Admins and Members only)
router.post('/:id/comments', authenticate, requireMember, async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const userId = req.user.id;
  try {
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = await Comment.create({ content, postId, userId });
    res.json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all comments for a post – public endpoint
router.get('/:id/comments', async (req, res) => {
  const postId = req.params.id;
  try {
    const comments = await Comment.findAll({
      where: { postId },
      include: [{ model: User, attributes: ['username'] }],
      order: [['created_at', 'ASC']]
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
