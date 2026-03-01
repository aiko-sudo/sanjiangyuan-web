const mongoose = require('mongoose');

// Vercel Serverless 这里的连接需要缓存
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // 禁用缓冲，Serverless 环境下建议关闭
      serverSelectionTimeoutMS: 2000, // 2秒超时，防止长时间阻塞请求
    };
    // 使用 127.0.0.1 而不是 localhost，防止 Node 18+ 的 IPv6 (::1) 长时间挂起导致 socket hang up
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sanjiangyuan';
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('✅ New MongoDB Connection Established');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = connectToDatabase;
