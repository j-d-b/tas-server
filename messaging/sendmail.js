const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const handlebars = require('handlebars');

const mgTransporter = nodemailer.createTransport(mg({
  auth: {
    api_key: 'process.env.MG_API_KEY',
    domain: 'process.env.MG_DOMAIN'
  }
}));

const baseTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_EMAIL_PASS
  }
});

const buildResetLinkMailOptions = (toEmail, resetLink) => {
  return {
    from: `BCTC TAS 🚚 <${process.env.FROM_EMAIL}>`,
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
  };
};

const buildRegistrationReceivedMailOptions = (toEmail, loginLink) => {
  return {
    from: `BCTC TAS 🚚 <${process.env.FROM_EMAIL}>`,
    to: toEmail,
    subject: 'Registration Received',
    text: `
      Your account has been confirmed. Follow the link below to login.\n
      ${loginLink}
    `,
    html: `
      <div style="text-align:center;">
        <h1 style="text-align:center;">Registration Received</h1>
        <p>Thank you for signing up for the BCTC TAS!</p>
        <p>We've received your registration information and sent your request to TAS administrators for review.</p>
        <p>You will be notified once an admin has confirmed your account, at which point you can log in.</p>
        <p>Sit tight until then 👍</p>
      </div>
    `
  };
};

const buildVerifyEmailMailOptions = (toEmail, verifyLink) => {
  return {
    from: `BCTC TAS 🚚 <${process.env.FROM_EMAIL}>`,
    to: toEmail,
    subject: 'Account Confirmed - Verify Your Email',
    text: `
      Your account has been confirmed by an administrator!\n
      You're now ready to log in and use the BCTC TAS. Please verify your email and log in using the link below.\n
      ${verifyLink}
    `,
    html: `
      <div style="text-align:center;">
        <h1 style="text-align:center;">Account Confirmed - Verify Your Email</h1>
        <p>Your account has been confirmed by an administrator!</p>
        <p>You're now ready to log in and use the BCTC TAS. Please verify your email and log in using the link below.</p>
        <a href="${verifyLink}">Verify & Log In</a>
      </div>
    `
  };
};

// return async function to send given link to given email
const sendLink = (buildMailOptions, transporter) => {
  return async (toEmail, link) => {
    return await transporter.sendMail(buildMailOptions(toEmail, link));
  };
};

module.exports.sendResetLink = sendLink(buildResetLinkMailOptions, baseTransporter);
module.exports.sendRegistrationRecievedMail = async toEmail => await mgTransporter.sendMail(buildRegistrationReceivedMailOptions(toEmail));
module.exports.sendVerifyEmailLink = sendLink(buildVerifyEmailMailOptions, baseTransporter);
