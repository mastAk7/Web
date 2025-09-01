const mongoose = require('mongoose');
async function connectDB(uri) {
    if (!uri) return; // Optional
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log('MongoDB connected');
}
module.exports = { connectDB };