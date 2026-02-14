const express = require('express');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// 获取用户列表
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, keyword } = req.query;
    const query = keyword ? { nickname: new RegExp(keyword, 'i') } : {};
    
    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取单个用户
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: '用户不存在' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建用户（仅管理员）
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { username, password, nickname, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: '用户名已存在' });
    
    const user = new User({ username, password, nickname, role });
    await user.save();
    
    res.status(201).json({ message: '创建成功', user: { id: user._id, username, nickname, role } });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除用户（仅管理员）
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: '删除成功' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
