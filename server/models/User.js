const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true },
  avatar: { type: String, default: '' },
  intro: { type: String, default: '尚未填写个人简介' },
  level: { type: String, default: '青铜守护者' },
  contribution: { type: Number, default: 0 },
  guardianDays: { type: Number, default: 0 },
  guardianGrids: { type: Number, default: 0 },
  role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
