const connectDB = require('../database');
const getNewPosts = require('../getNewPosts');
const sendMail = require('../sendMail');

export default async function handler(req, res) {
  // 데이터베이스 연결
  await connectDB();

  // 새로운 포스트 가져오기
  const newPosts = await getNewPosts();

  // 새로운 포스트가 있는 경우 메일 전송
  if (newPosts && newPosts.length > 0) {
    await sendMail(newPosts);
  }
}
