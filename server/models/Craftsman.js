const mongoose = require('mongoose');

const craftsmanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: '' },
  level: { type: String, enum: ['国家级传承人', '省级传承人', '市级传承人'] },
  skills: [String],
  intro: String,
  years: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
  works: { type: Number, default: 0 },
  guardians: { type: Number, default: 0 },
  activities: [{
    content: String,
    time: String
  }],
  skillsSteps: [{
    image: String,
    title: String,
    desc: String
  }],
  category: { type: String, default: 'thangka' }
});

module.exports = mongoose.model('Craftsman', craftsmanSchema);
