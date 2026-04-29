const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

// @route   GET /api/posts
// @desc    Get all posts with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const tag = req.query.tag || '';

    const query = { published: true };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    if (tag) {
      query.tags = tag;
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .populate('commentCount')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      posts,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID or slug
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findOne({
      $or: [
        ...(req.params.id.match(/^[a-f\d]{24}$/i) ? [{ _id: req.params.id }] : []),
        { slug: req.params.id },
      ],
    })
      .populate('author', 'name avatar bio')
      .populate('commentCount');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post(
  '/',
  protect,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { title, content, excerpt, coverImage, tags, published } = req.body;

      const post = await Post.create({
        title,
        content,
        excerpt,
        coverImage,
        tags: tags ? tags.map((t) => t.toLowerCase().trim()) : [],
        author: req.user._id,
        published: published !== undefined ? published : true,
      });

      const populated = await post.populate('author', 'name avatar');
      res.status(201).json(populated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { title, content, excerpt, coverImage, tags, published } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;
    post.tags = tags ? tags.map((t) => t.toLowerCase().trim()) : post.tags;
    post.published = published !== undefined ? published : post.published;

    const updated = await post.save();
    const populated = await updated.populate('author', 'name avatar');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/posts/:id/like
// @desc    Like / unlike a post
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/posts/user/:userId
// @desc    Get posts by a specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId, published: true })
      .populate('author', 'name avatar')
      .populate('commentCount')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
