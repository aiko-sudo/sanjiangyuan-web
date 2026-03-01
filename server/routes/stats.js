const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const Craftsman = require('../models/Craftsman');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 总体数据概览 (公开)
router.get('/overview', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments({ status: 'published' });
    const craftsmanCount = await Craftsman.countDocuments();
    const pendingPostCount = await Post.countDocuments({ status: 'pending' });

    res.json({
      users: userCount,
      posts: postCount,
      craftsmen: craftsmanCount,
      pendingPosts: pendingPostCount
    });
  } catch (err) {
    console.error('Error fetching stats overview:', err);
    res.status(500).json({ message: '服务器错误', error: err.message });
  }
});

// 最近活动 (公开)
router.get('/recent', async (req, res) => {
  try {
    const recentPosts = await Post.find({ status: 'published' })
      .sort({ createTime: -1 })
      .limit(10);
    res.json({ recentPosts });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
