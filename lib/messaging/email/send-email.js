const nodemailer = require('nodemailer');

const logger = require('../../logging/logger');
const { SMTP_SERVER_HOST, SMTP_SERVER_PORT, FROM_EMAIL, TIMEZONE, NODE_ENV } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: SMTP_SERVER_PORT,
  secure: false
});

const mgSend = async (mailOptions) => {
  await transporter.sendMail(mailOptions)
    .then(message => logger.info('Email Queued: ' + JSON.stringify(message)))
    .catch((err) => {
      logger.error(err);
      throw err;
    });
};

const createMailOptionsBuilder = (subject, templateFile) => {
  return (toEmail, data) => ({
    from: `BCTC TAS 🚚 <${FROM_EMAIL}>`,
    to: toEmail,
    subject: subject,
    template: {
      name: `lib/messaging/email/templates/${templateFile}`,
      engine: 'handlebars',
      context: { ...data, timezone: TIMEZONE }
    },
    attachments: [
      {
        filename: 'simple-logo.png',
        path: 'lib/messaging/email/simple-logo.png',
        cid: 'simple-logo'
      }
    ]
  });
};

const buildSendFunc = (title, templateFile) => {
  if (NODE_ENV === 'test') {
    return () => null;
  }

  return async (toEmail, data) => (
    mgSend(createMailOptionsBuilder(title, templateFile)(toEmail, data))
  ); 
};

module.exports = {
  sendSignupReceivedNotice: buildSendFunc('Thank You for Registering', 'registration-received.hbs'),
  sendPassResetLink: buildSendFunc('Reset Account Password', 'reset-pass.hbs'),
  sendVerifyEmailLink: buildSendFunc('Verify Your Email', 'verify-email.hbs'),
  sendAcctConfirmedNotice: buildSendFunc('Account Confirmed - Verify Your Email', 'acct-confirmed.hbs'),
  sendApptReminder: buildSendFunc('Appointment Reminder', 'appt-reminder.hbs'),
  sendApptRescheduledNotice: buildSendFunc('Appointment Rescheduled Notice', 'appt-rescheduled.hbs'),
  sendApptDeletedNotice: buildSendFunc('Appointment Deleted Notice', 'appt-deleted.hbs'),
  sendEmailChangedNotice: buildSendFunc('Account Email Changed', 'email-changed.hbs')
};
