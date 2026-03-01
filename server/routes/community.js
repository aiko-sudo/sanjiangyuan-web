const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

// 获取已发布的帖子列表（公开，无需登录）
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, category } = req.query;
        const query = { status: 'published' };
        if (category && category !== 'all') query.category = category;

        const posts = await Post.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createTime: -1 });

        const total = await Post.countDocuments(query);
        res.json({ posts, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
    } catch (err) {
        console.error('Community fetch error:', err);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 发布帖子（公开，无需登录，自动设为 published 方便演示）
router.post('/', async (req, res) => {
    try {
        const { content, tags, category, author } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ message: '内容不能为空' });
        }

        const post = new Post({
            content: content.trim(),
            tags: tags || [],
            category: category || 'story',
            images: req.body.images || [],
            author: author || { nickname: '匿名用户', avatar: '', level: '青铜守护者' },
            status: 'published',
            likes: 0,
            comments: 0
        });

        await post.save();
        res.status(201).json({ message: '发布成功', post });
    } catch (err) {
        console.error('Community post error:', err);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 点赞
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!post) return res.status(404).json({ message: '帖子不存在' });
        res.json({ likes: post.likes });
    } catch (err) {
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;
