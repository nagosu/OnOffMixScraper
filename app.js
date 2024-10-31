const express = require('express');
const app = express();
const PORT = 8000;

const cron = require('node-cron');
const connectDB = require('./database');
const getNewPosts = require('./getNewPosts');
const sendMail = require('./sendMail');

connectDB();

cron.schedule('0 0 * * *', async () => {
  const newPosts = await getNewPosts();

  if (newPostt && newPosts.length > 0) {
    await sendMail(newPosts);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
