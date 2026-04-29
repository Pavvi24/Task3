const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @route   GET /api/comments/:postId
// @desc    Get all comments for a post
// @access  Public
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      parentComment: null,
    })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    // Attach replies for each top-level comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'name avatar')
          .sort({ createdAt: 1 });
        return { ...comment.toObject(), replies };
      })
    );

    res.json(commentsWithReplies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/comments/:postId
// @desc    Add a comment to a post
// @access  Private
router.post(
  '/:postId',
  protect,
  [body('content').trim().notEmpty().withMessage('Comment content is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      const comment = await Comment.create({
        content: req.body.content,
        author: req.user._id,
        post: req.params.postId,
        parentComment: req.body.parentComment || null,
      });

      const populated = await comment.populate('author', 'name avatar');
      res.status(201).json({ ...populated.toObject(), replies: [] });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Also delete replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });
    await comment.deleteOne();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
