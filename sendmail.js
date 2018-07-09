const nodemailer = require('nodemailer');

const baseTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_EMAIL_PASS
  }
});

const buildResetLinkMailOptions = (toEmail, resetLink) => {
  return {
    from: '"BCTC TAS 🚚" <wergaburg@gmail.com>', // TODO prod
    to: toEmail,
    subject: 'Reset Account Password',
    text: `
      Click the below link to reset your account password for BCTC TAS.\n
      ${resetLink}
    `,
    html: `
      <div style="text-align:center;">
        <h1 style="text-align:center;">Reset Password</h1>
        <p>Click the link below to reset your account password for BCTC TAS</p>
        <div style="display: flex; align-items: center; height: 30px; background-color: limegreen; font-weight: bold; border-radius: 4px; font-size: 16px;">
          <a style="color: white; text-decoration: none;" href="${resetLink}">Reset Password</a>
        </div>
      </div>
    `
  }
};

const buildAcctConfirmedMailOptions = (toEmail, loginLink) => {
  return {
    from: '"BCTC TAS 🚚" <wergaburg@gmail.com>',
    to: toEmail,
    subject: 'Account Confirmed',
    text: `
      Your account has been confirmed. Follow the link below to login.\n
      ${loginLink}
    `,
    html: `
      <div style="text-align:center;">
        <h1 style="text-align:center;">Account Confirmed</h1>
        <p>Your account has been confirmed by an administrator!</p>
        <p>You may now login and use the BCTC TAS. Follow the link below to login.</p>
        <a href="${loginLink}">Login</a>
      </div>
    `
  }
};

// return async function to send given link to given email
const sendLink = (buildMailOptions, transporter) => {
  return async (toEmail, link) => {
    return await transporter.sendMail(buildMailOptions(toEmail, link));
  }
};

module.exports.sendResetLink = sendLink(buildResetLinkMailOptions, baseTransporter);
module.exports.sendAcctConfirmedLink = sendLink(buildAcctConfirmedMailOptions, baseTransporter);
