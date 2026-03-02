const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');

// 获取指定 key 的设置
router.get('/:key', async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: req.params.key });
        if (!setting) {
            return res.status(404).json({ message: '设置未找到' });
        }
        res.json(setting);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 更新或创建设置 (仅限管理员)
router.put('/:key', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '无权操作' });
    }

    try {
        const { value, type, description } = req.body;
        let setting = await Setting.findOne({ key: req.params.key });

        if (setting) {
            setting.value = value;
            if (type) setting.type = type;
            if (description) setting.description = description;
            await setting.save();
        } else {
            setting = new Setting({
                key: req.params.key,
                value,
                type: type || 'text',
                description
            });
            await setting.save();
        }
        res.json(setting);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
