const express = require('express');
const app = express();
const PORT = 8000;

const connectDB = require('./database');
const getNewPosts = require('./getNewPosts');
const sendMail = require('./sendMail');

connectDB();

const newPosts = getNewPosts();

if (newPosts && newPosts.length > 0) {
  sendMail(newPosts);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
