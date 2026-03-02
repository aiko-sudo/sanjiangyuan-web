const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const craftsmanSchema = new mongoose.Schema({
    name: String,
    avatar: String,
    level: String,
    category: String,
    guardians: Number
}, { strict: false });

const Craftsman = mongoose.model('Craftsman', craftsmanSchema);

async function checkAndInit() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);

        const count = await Craftsman.countDocuments();
        console.log('Current craftsman count:', count);

        if (count === 0) {
            console.log('No craftsmen found. Initializing...');
            const defaultCraftsmen = [
                {
                    name: '更登达吉',
                    avatar: '/craftsmen/gengdengdaji.jpg',
                    level: '国家级传承人',
                    skills: ['唐卡绘制', '金绘'],
                    category: 'thangka',
                    guardians: 524
                },
                {
                    name: '更太加',
                    avatar: '/craftsmen/gengtaijia.jpg',
                    level: '省级传承人',
                    skills: ['堆绣工艺', '刺绣'],
                    category: 'embroidery',
                    guardians: 218
                },
                {
                    name: '扎西才让',
                    avatar: '/craftsmen/zhaxicairang.jpg',
                    level: '市级传承人',
                    skills: ['氆氇编织', '纺线'],
                    category: 'pulu',
                    guardians: 156
                }
            ];
            await Craftsman.insertMany(defaultCraftsmen);
            console.log('Initialization complete.');
        } else {
            const all = await Craftsman.find();
            all.forEach(c => console.log(`- ${c.name} (${c.category})`));
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkAndInit();
