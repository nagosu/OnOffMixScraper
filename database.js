require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB에 이미 연결되어 있습니다.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      dbName: 'posts',
    });
    console.log('Successfully connected to MongoDB');
  } catch (e) {
    console.error('Error connecting to MongoDB:', e);
  }
};

module.exports = connectDB;
