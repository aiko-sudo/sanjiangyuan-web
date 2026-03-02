const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const Craftsman = require('../server/models/Craftsman');
    const items = await Craftsman.find({});
    console.log('COUNT:', items.length);
    items.forEach(i => console.log('-', i.name, '(' + i.category + ')'));
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
