const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_EMAIL_PASS
  }
});

const generateResetLinkMailOptions = (toEmail, resetLink) => {
  return {
    from: '"BCTC TAS 🚚" <wergaburg@gmail.com>',
    to: toEmail,
    subject: 'Reset Password',
    text: `
      Click the below link to reset your account password for BCTC TAS\n
      ${resetLink}
    `,
    html: `
      <div style="text-align:center;">
        <h1 style="text-align:center;">Reset Password</h1>
        <p>Click the below link to reset your account password for BCTC TAS</p>
        <a href="${resetLink}">Reset Password</a>
      </div>
    `
  }
};

// return async function to given link to given email, w/ closure
const sendResetLink = (generateResetLinkMailOptions, transporter) => {
  return async (toEmail, resetLink) => {
    return await transporter.sendMail(generateResetLinkMailOptions(toEmail, resetLink));
  }
};

module.exports.sendResetLink = sendResetLink(generateResetLinkMailOptions, transporter);
