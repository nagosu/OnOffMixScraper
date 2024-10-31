const express = require('express');
const app = express();
const PORT = 8000;

const getNewPosts = require('./getNewPosts');
const connectDB = require('./database');
const sendMail = require('./sendMail');

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

getNewPosts().then((newPostTitles) => {
  sendMail(newPostTitles);
});
