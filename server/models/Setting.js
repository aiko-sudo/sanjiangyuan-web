const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    type: { type: String, default: 'text' }, // text, json, html
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
