require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = () => {
  console.log('Connecting to MongoDB with URI:', process.env.MONGO_DB_URI); // URI 확인용 로그 추가

  mongoose
    .connect(process.env.MONGO_DB_URI, {
      dbName: 'posts',
    })
    .then(() => {
      console.log('Successfully connected to MongoDB');
    })
    .catch((e) => {
      console.error('Error connecting to MongoDB:', e);
    });
};

module.exports = connectDB;
