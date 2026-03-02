const express = require('express');
const Craftsman = require('../models/Craftsman');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// 获取传承人列表 (公开)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, keyword } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (keyword) query.name = new RegExp(keyword, 'i');

    console.log('[Craftsmen API] Query:', query);
    const craftsmen = await Craftsman.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ guardians: -1 });

    console.log(`[Craftsmen API] Found ${craftsmen.length} items`);
    const total = await Craftsman.countDocuments(query);
    res.json({ craftsmen, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Error fetching craftsmen:', err);
    res.status(500).json({ message: '服务器错误', error: err.message });
  }
});

// 获取单个传承人 (公开)
router.get('/:id', async (req, res) => {
  try {
    const craftsman = await Craftsman.findById(req.params.id);
    if (!craftsman) return res.status(404).json({ message: '传承人不存在' });
    res.json({ craftsman });
  } catch (err) {
    console.error('Error fetching craftsman by id:', err);
    res.status(500).json({ message: '服务器错误', error: err.message });
  }
});

// 创建传承人
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const craftsman = new Craftsman(req.body);
    await craftsman.save();
    res.status(201).json({ message: '创建成功', craftsman });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新传承人
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const craftsman = await Craftsman.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: '更新成功', craftsman });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除传承人
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Craftsman.findByIdAndDelete(req.params.id);
    res.json({ message: '删除成功' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
