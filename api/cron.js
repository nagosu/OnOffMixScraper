const connectDB = require('../database/database');
const getOnOffMixPosts = require('../services/cron/getOnOffMixPosts');
const sendMail = require('../services/cron/sendMail');

export default async function handler(req, res) {
  // 데이터베이스 연결
  await connectDB();

  // @GET("/api/cron")
  if (req.method === 'GET') {
    // 새로운 OnOffMix 포스트 가져오기
    const newOnOffMixPosts = await getOnOffMixPosts();

    // 새로운 포스트가 있는 경우 메일 전송
    if (newOnOffMixPosts && newOnOffMixPosts.length > 0) {
      await sendMail(newOnOffMixPosts);
    }

    res.status(200).json({ message: '크롤링 성공' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
