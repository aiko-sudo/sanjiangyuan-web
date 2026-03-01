const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 确保 uploads 目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('不支持的文件类型：只能上传图片'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 限制 5MB
    }
});

// 处理上传
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '没有上传文件' });
        }

        // 生成前端可访问的 URL
        const fileUrl = `/uploads/${req.file.filename}`;

        res.json({
            message: '上传成功',
            url: fileUrl
        });
    } catch (error) {
        console.error('❌ Upload error details:', {
            message: error.message,
            stack: error.stack,
            file: req.file
        });
        res.status(500).json({ message: '上传失败', error: error.message, details: error.stack });
    }
});

// 错误处理中间件
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: '文件太大，最大允许 5MB' });
        }
        return res.status(400).json({ message: '上传错误', error: error.message });
    } else if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
});

module.exports = router;
