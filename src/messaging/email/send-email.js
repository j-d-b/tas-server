const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const logger = require('../../logging/logger');

const mgTransporter = nodemailer.createTransport(mg({
  auth: {
    api_key: process.env.MG_API_KEY,
    domain: process.env.MG_DOMAIN
  }
}));

const mgSend = async (mailOptions) => {
  await mgTransporter.sendMail(mailOptions)
    .then(message => logger.info('Email Queued: ' + JSON.stringify(message)))
    .catch((err) => {
      logger.error(err);
      throw err;
    });
};

const createMailOptionsBuilder = (subject, templateFile) => {
  return (toEmail, data) => ({
    from: `BCTC TAS 🚚 <${process.env.MG_FROM_EMAIL}>`,
    to: toEmail,
    subject: subject,
    template: {
      name: `src/messaging/email/templates/${templateFile}`,
      engine: 'handlebars',
      context: data
    },
    attachments: [
      {
        filename: 'simple-logo.png',
        path: 'src/messaging/email/simple-logo.png',
        cid: 'simple-logo'
      }
    ]
  });
};

module.exports = {
  sendSignupReceivedNotice: async (toEmail, data) => mgSend(createMailOptionsBuilder('Thank You for Registering', 'registration-received.hbs')(toEmail, data)),
  sendPassResetLink: async (toEmail, data) => mgSend(createMailOptionsBuilder('Reset Account Password', 'reset-pass.hbs')(toEmail, data)),
  sendVerifyEmailLink: async (toEmail, data) => mgSend(createMailOptionsBuilder('Verify Your Email', 'verify-email.hbs')(toEmail, data)),
  sendAcctConfirmedNotice: async (toEmail, data) => mgSend(createMailOptionsBuilder('Account Confirmed - Verify Your Email', 'acct-confirmed.hbs')(toEmail, data)),
  sendApptReminder: async (toEmail, data) => mgSend(createMailOptionsBuilder('Appointment Reminder', 'appt-reminder.hbs')(toEmail, data))
};
