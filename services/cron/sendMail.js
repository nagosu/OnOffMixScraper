// sendMail.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const Email = require('../../models/Email');

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

  const mailOptions = {
    from: `nagosu <${process.env.MY_EMAIL}>`,
    to: '',
    bcc: emailsToSend, // 숨은 참조
    subject: '새로운 포스트 알림',
    text: newPostTitle,
  };

  try {
    const info = await transporter.sendMail(mailOptions); // 메일 전송이 완료될 때까지 대기
    console.log('메일 전송 완료 :', info.response);
  } catch (error) {
    console.error('메일 전송 오류 : ', error);
  }
}

module.exports = sendMail;
