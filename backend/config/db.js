const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.USE_MEMORY_STORE === '1') {
    console.log('Using in-memory store (no MongoDB required)');
    global.USE_MEMORY_STORE = true;
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maternalhealth', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn('MongoDB unavailable - using in-memory store. Set MONGODB_URI for persistence.');
    global.USE_MEMORY_STORE = true;
  }
};

module.exports = connectDB;
