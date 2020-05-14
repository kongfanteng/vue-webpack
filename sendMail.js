const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: '163',
  port: 465,
  secureConnection: true,
  auth: {
    user: '1821091009@163.com',
    pass: 'kong1994*'
  }
})
function sendMail(message) {
  let mailOptions = {
    from: '"18210501009@163.com" <18210501009@163.com>',
    to: '18210501009@163.com',
    subject: '部署通知',
    html: message
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  })
}
module.exports = sendMail;