const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const mailOptions = {
  from: '"Fred Foo 👻" <foo@example.com>', // sender address
  to: 'bar@example.com, baz@example.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'Hello world?', // plain text body
  html: '<b>Hello world?</b>' // html body
};


// send password reset link to given email
export default function sendResetLink(toEmail) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });

}
