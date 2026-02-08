const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const Craftsman = require('../models/Craftsman');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 总体数据概览
router.get('/overview', auth, async (req, res) => {
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
    res.status(500).json({ message: '服务器错误' });
  }
});

// 最近活动
router.get('/recent', auth, async (req, res) => {
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
