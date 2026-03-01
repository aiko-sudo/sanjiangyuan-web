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

    // 审核状态检查 (除了管理员)
    if (user.role !== 'admin' && user.status !== 'approved') {
      const msg = user.status === 'pending' ? '账号正在审核中，请耐心等待' : '您的注册申请已被拒绝';
      return res.status(403).json({ message: msg });
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

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, nickname } = req.body;
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    const user = new User({
      username,
      password,
      nickname,
      role: 'editor',
      status: 'pending'
    });
    await user.save();

    res.status(201).json({ message: '注册申请已提交，请等待管理员审核' });
  } catch (err) {
    res.status(500).json({ message: '注册失败，服务器错误' });
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

// 初始化管理员账号（支持浏览器 GET 访问）
router.get('/init', async (req, res) => {
  try {
    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      return res.json({ message: '管理员已存在' });
    }

    const admin = new User({
      username: 'admin',
      password: 'admin123',
      nickname: '超级管理员',
      role: 'admin',
      status: 'approved'
    });
    await admin.save();

    res.json({ message: '管理员创建成功，用户名: admin，密码: admin123' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
