const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function run() {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to:', uri);
    await mongoose.connect(uri);

    const Craftsman = require('../server/models/Craftsman');

    console.log('Clearing existing craftsmen...');
    await Craftsman.deleteMany({});

    const defaultCraftsmen = [
        {
            name: '更登达吉',
            avatar: '/craftsmen/gengdengdaji.jpg',
            level: '国家级传承人',
            skills: ['唐卡绘制', '金绘'],
            category: 'thangka',
            guardians: 524,
            intro: '中国工艺美术大师，国家级非物质文化遗产代表性传承人。',
            years: 45,
            students: 120,
            works: 300,
            activities: [
                { content: '在热贡艺术博物馆进行唐卡修复教学', time: '2024-03-01' },
                { content: '完成《千手观音》巨幅唐卡绘制', time: '2024-02-15' }
            ],
            skillsSteps: [
                { image: '/craftsmen/step1.jpg', title: '画布处理', desc: '将白布绷在木框上，涂抹胶水和滑石粉。' }
            ]
        },
        {
            name: '更太加',
            avatar: '/craftsmen/gengtaijia.jpg',
            level: '省级传承人',
            skills: ['堆绣工艺', '刺绣'],
            category: 'embroidery',
            guardians: 218,
            intro: '热贡艺术著名堆绣大师，致力于传统技艺的现代传承。',
            years: 30,
            students: 45,
            works: 120,
            activities: [
                { content: '参加青海省非遗成果展', time: '2024-02-28' }
            ],
            skillsSteps: [
                { image: '/craftsmen/step1.jpg', title: '剪裁', desc: '根据图案剪出不同形状的绸缎块。' }
            ]
        },
        {
            name: '扎西才让',
            avatar: '/craftsmen/zhaxicairang.jpg',
            level: '市级传承人',
            skills: ['氆氇编织', '纺线'],
            category: 'pulu',
            guardians: 156,
            intro: '三江源地区优秀的氆氇编织传承人。',
            years: 25,
            students: 30,
            works: 80,
            activities: [
                { content: '向当地村落妇女传授编织技巧', time: '2024-03-05' }
            ],
            skillsSteps: [
                { image: '/craftsmen/step1.jpg', title: '梳理', desc: '将羊毛梳理整齐，准备纺线。' }
            ]
        }
    ];

    await Craftsman.insertMany(defaultCraftsmen);
    const count = await Craftsman.countDocuments();
    console.log('Insertion complete. Total count:', count);
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
