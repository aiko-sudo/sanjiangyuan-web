const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db'); // 使用缓存连接

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 日志中间件 (优先执行，用于调试到底请求卡在哪里)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// 静态文件服务在 Vercel 上通常由前端构建输出处理，但在本地或特定配置下保留无妨
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
        message: '请确保本地 MongoDB 已安装并启动',
        hint: '你可以搜索 "MongoDB Compass" 来查看本地数据库状态'
      });
    }
    next();
  }
});



// 健康检查路由
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date() });
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
      role: 'admin'
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
