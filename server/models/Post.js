const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    nickname: String,
    avatar: String,
    level: String
  },
  content: { type: String, required: true },
  images: [String],
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  tags: [String],
  category: { type: String, default: 'story' },
  status: { type: String, enum: ['pending', 'published', 'rejected'], default: 'pending' },
  isFeatured: { type: Boolean, default: false },
  createTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
