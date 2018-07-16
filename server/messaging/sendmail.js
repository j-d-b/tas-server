const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const handlebars = require('handlebars');

const mgTransporter = nodemailer.createTransport(mg({
  auth: {
    api_key: process.env.MG_API_KEY,
    domain: process.env.MG_DOMAIN
  }
}));

const mgSend = async mailOptions => await mgTransporter.sendMail(mailOptions);

const createMailOptionsBuilder = (subject, templateFile) => {
  return (toEmail, data) => ({
    from: `BCTC TAS 🚚 <${process.env.MG_FROM_EMAIL}>`,
    to: toEmail,
    subject: subject,
    template: {
      name: `server/messaging/email/templates/${templateFile}`,
      engine: 'handlebars',
      context: data
    }
  });
};

module.exports = {
  sendSignupReceivedNotice: async (toEmail, data) => await mgSend(createMailOptionsBuilder('Thank You for Registering', 'signup-received.hbs')(toEmail, data)),
  sendPassResetLink: async (toEmail, data) => await mgSend(createMailOptionsBuilder('Reset Account Password', 'reset-pass.hbs')(toEmail, data)),
  sendVerifyEmailLink: async (toEmail, data) => await mgSend(createMailOptionsBuilder('Verify Your Email', 'verify-email.hbs')(toEmail, data)),
  sendAcctConfirmedNotice: async (toEmail, data) => await mgSend(createMailOptionsBuilder('Account Confirmed - Verify Your Email', 'acct-confirmed.hbs')(toEmail, data))
};
