const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function check() {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        const Craftsman = require('../server/models/Craftsman');
        const count = await Craftsman.countDocuments();
        console.log('Craftsman count:', count);
        const all = await Craftsman.find();
        console.log('Craftsmen details:', JSON.stringify(all, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
