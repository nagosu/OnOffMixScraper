// sendMail.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const Email = require('./models/Email');

async function loadEmails() {
  const emails = await Email.find({}, 'email'); // 모든 이메일 주소 가져오기
  return emails.map((email) => email.email); // 이메일 주소만 추출
}

async function sendMail(newPostTitle) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.APP_PASSWORD, // 이메일 계정의 앱 비밀번호
    },
  });

  const emailsToSend = await loadEmails();

  console.log('emailsToSend:', emailsToSend);

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: emailsToSend.join(','),
    subject: '새로운 포스트 알림',
    text: newPostTitle,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('메일 전송 오류 : ', error);
    } else {
      console.log('메일 전송 완료 :', info.response);
    }
  });
}

module.exports = sendMail;
