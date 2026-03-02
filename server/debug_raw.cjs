const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const collection = mongoose.connection.collection('craftsmen');
    const all = await collection.find({}).toArray();
    console.log('RAW DOCUMENTS:', JSON.stringify(all, null, 2));

    const settings = mongoose.connection.collection('settings');
    const story = await settings.findOne({ key: 'eco_story' });
    console.log('STORY EXISTS:', !!story);

    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
