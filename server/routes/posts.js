const express = require('express');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 获取帖子列表
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, keyword } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (keyword) query.content = new RegExp(keyword, 'i');
    
    const posts = await Post.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createTime: -1 });
    
    const total = await Post.countDocuments(query);
    res.json({ posts, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取单个帖子
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '帖子不存在' });
    res.json({ post });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新帖子状态
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, isFeatured } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status, isFeatured },
      { new: true }
    );
    res.json({ message: '更新成功', post });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除帖子
router.delete('/:id', auth, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: '删除成功' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 统计数据
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const total = await Post.countDocuments();
    const pending = await Post.countDocuments({ status: 'pending' });
    const published = await Post.countDocuments({ status: 'published' });
    const featured = await Post.countDocuments({ isFeatured: true });
    
    res.json({ total, pending, published, featured });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
