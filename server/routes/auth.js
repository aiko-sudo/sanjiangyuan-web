const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !await user.comparePassword(password)) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }
    
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取当前用户
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

// 修改密码
router.put('/password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!await user.comparePassword(oldPassword)) {
      return res.status(400).json({ message: '原密码错误' });
    }
    
    user.password = newPassword;
    await user.save();
    res.json({ message: '密码修改成功' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 初始化管理员账号（第一次运行时使用）
router.post('/init', async (req, res) => {
  try {
    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      return res.json({ message: '管理员已存在' });
    }
    
    const admin = new User({
      username: 'admin',
      password: 'admin123',
      nickname: '超级管理员',
      role: 'admin'
    });
    await admin.save();
    
    res.json({ message: '管理员创建成功，用户名: admin，密码: admin123' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
