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

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 数据库连接中间件
app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next();

  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('❌ 数据库未连接:', error.message);
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

// 直接在 index.js 定义初始化路由
app.get('/api/init', async (req, res) => {
  try {
    const User = require('./models/User');
    const Setting = require('./models/Setting');

    // 初始化管理员
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const admin = new User({
        username: 'admin',
        password: 'admin123',
        nickname: '超级管理员',
        role: 'admin',
        status: 'approved'
      });
      await admin.save();
    }

    // 初始化生态故事
    const existingStory = await Setting.findOne({ key: 'eco_story' });
    if (!existingStory) {
      const defaultStory = new Setting({
        key: 'eco_story',
        type: 'text',
        description: '生态数据中心页面显示的生态故事文章',
        value: `青海，这片被誉为“中华水塔”的大地，正书写着人与自然和谐共生的壮丽篇章。作为长江、黄河、澜沧江的发源地，三江源不仅是中国重要的生态安全屏障，更是全球高寒生物多样性最集中的区域之一。

近年来，随着国家公园体制试点的深入开展，这里的生态环境发生了巨大变化。曾经稀见的雪豹、藏羚羊如今频繁出现在红外相机的镜头中，甚至走入了牧民的视野。草地逐渐恢复生机，湿地面积持续扩大，水质始终保持在优良水平。

但这背后是无数守护者的默默付出。成千上万名牧民生态管护员放下了牧鞭，拿起了巡护手册，巡回在雪山草地之间。他们用双脚丈量国土，用初心守护江源。他们的故事，是关于生命、关于家园、关于未来最动人的注脚。保护三江源，不仅是为了青海，更是为了中国、为了世界。让我们通过数据，见证这里的每一次心跳。`
      });
      await defaultStory.save();
    }

    res.json({ message: '✅ 初始化成功', username: 'admin', password: 'admin123' });
  } catch (err) {
    console.error('Init error:', err);
    res.status(500).json({ error: '初始化失败', details: err.message });
  }
});

// 加载业务路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/craftsmen', require('./routes/craftsmen'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/community', require('./routes/community'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/settings', require('./routes/settings'));

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

// 本地启动
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 本地服务器运行在 http://localhost:${PORT}`);
  });
}

module.exports = app;
