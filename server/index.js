const path = require('path');
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');

// Vercel 生产环境下从 process.env 读取，不需要读取 .env 文件
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 记录所有访问 (Vercel Logs 中可见)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// 重定向 /api/auth/init 到 /api/init (双保险)
app.get('/api/auth/init', (req, res, next) => {
  if (req.method === 'GET') {
    console.log('Redirecting /api/auth/init to /api/init');
    return res.redirect(307, '/api/init');
  }
  next();
});

// 静态文件服务在 Vercel 上通常由前端构建输出处理
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 数据库连接中间件 (尝试连接，但不长时间阻塞请求)
app.use(async (req, res, next) => {
  // 健康检查接口不需要数据库也能返回
  if (req.path === '/api/health') return next();

  try {
    // 增加一个简单的超时心跳检查或直接尝试连接
    await connectToDatabase();
    next();
  } catch (error) {
    // 只在访问具体 API 时报错，且不让进程挂起
    console.error('❌ 数据库未连接，请检查 MongoDB 是否启动:', error.message);
    if (req.path.startsWith('/api')) {
      return res.status(500).json({
        error: '数据库连接失败',
        message: '请确保 MongoDB 连接字符串正确',
        hint: process.env.VERCEL ? '请在 Vercel 控制台检查 MONGODB_URI 环境变量' : '请确保本地 MongoDB 已启动'
      });
    }
    next();
  }
});



// 健康检查路由
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    time: new Date(),
    env: {
      MONGODB_URI_SET: !!process.env.MONGODB_URI,
      JWT_SECRET_SET: !!process.env.JWT_SECRET,
      VERCEL: !!process.env.VERCEL
    }
  });
});

// 数据库测试路由
app.get('/api/debug-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const state = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

    res.json({
      database_state: states[state] || 'unknown',
      uri_exists: !!process.env.MONGODB_URI,
      uri_prefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) + '...' : 'none'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 直接在 index.js 定义初始化路由，确保万无一失
app.get('/api/init', async (req, res) => {
  try {
    const User = require('./models/User');
    const existing = await User.findOne({ username: 'admin' });
    if (existing) return res.json({ message: '管理员已存在', user: 'admin' });

    const admin = new User({
      username: 'admin',
      password: 'admin123',
      nickname: '超级管理员',
      role: 'admin',
      status: 'approved'
    });
    await admin.save();
    res.json({ message: '✅ 管理员创建成功', username: 'admin', password: 'admin123' });
  } catch (err) {
    console.error('Init error:', err);
    res.status(500).json({ error: '初始化失败', details: err.message });
  }
});

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/craftsmen', require('./routes/craftsmen'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/community', require('./routes/community'));
app.use('/api/upload', require('./routes/upload'));

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

// 本地开发时启动服务器
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 本地服务器运行在 http://localhost:${PORT}`);
  });
}

// 导出 app 供 Vercel Serverless 使用
module.exports = app;
