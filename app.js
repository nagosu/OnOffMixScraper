const express = require('express');
const app = express();
const PORT = 8000;

const connectDB = require('./database');
const getOnOffMixPosts = require('./getOnOffMixPosts');
const sendMail = require('./sendMail');

connectDB();

const newPosts = getOnOffMixPosts();

if (newPosts && newPosts.length > 0) {
  sendMail(newPosts);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
