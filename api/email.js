const connectDB = require('../database');
const Email = require('../models/Email');

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // 사전 요청 (Preflight Request)일 경우, 응답만 보내고 종료
    return res.status(200).end();
  }

  // 데이터베이스 연결
  await connectDB();

  if (req.method === 'POST') {
    const { email } = req.body;

    // 이메일이 입력되지 않은 경우
    if (!email) {
      return res.status(400).json({ message: '이메일을 입력해주세요.' });
    }

    try {
      // 이메일을 DB에 저장
      const newEmail = new Email({ email });
      await newEmail.save();
      res.status(201).json({
        message: '이메일이 성공적으로 저장되었습니다.',
        email: newEmail,
      });
    } catch (error) {
      console.error('Error saving email:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
