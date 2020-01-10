const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const logger = require('../../logging/logger');
const { SMTP_SERVER_HOST, SMTP_SERVER_PORT, FROM_EMAIL, TIMEZONE, NODE_ENV } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: SMTP_SERVER_PORT,
  secure: false
});

transporter.use('compile', hbs({
  viewEngine: {
    partialsDir: 'lib/messaging/email/templates/',
    extname: '.hbs',
    defaultLayout: false
  },
  extName: '.hbs',
  viewPath: 'lib/messaging/email/templates/'
}));

const sendMail = async (mailOptions) => {
  await transporter.sendMail(mailOptions)
    .then(message => logger.info('Email Queued: ' + JSON.stringify(message)))
    .catch((err) => {
      logger.error(err);
      throw err;
    });
};

const createMailOptionsBuilder = (subject, templateName) => {
  return (toEmail, data) => ({
    from: `BCTC TAS 🚚 <${FROM_EMAIL}>`,
    to: toEmail,
    subject: subject,
    template: templateName,
    context: { ...data, timezone: TIMEZONE },
    attachments: [
      {
        filename: 'simple-logo.png',
        path: 'lib/messaging/email/simple-logo.png',
        cid: 'simple-logo'
      }
    ]
  });
};

const buildSendFunc = (title, templateName) => {
  if (NODE_ENV === 'test') {
    return () => null;
  }

  return async (toEmail, data) => (
    sendMail(createMailOptionsBuilder(title, templateName)(toEmail, data))
  ); 
};

module.exports = {
  sendSignupReceivedNotice: buildSendFunc('Thank You for Registering', 'registration-received'),
  sendPassResetLink: buildSendFunc('Reset Account Password', 'reset-pass'),
  sendVerifyEmailLink: buildSendFunc('Verify Your Email', 'verify-email'),
  sendAcctConfirmedNotice: buildSendFunc('Account Confirmed - Verify Your Email', 'acct-confirmed'),
  sendApptReminder: buildSendFunc('Appointment Reminder', 'appt-reminder'),
  sendApptRescheduledNotice: buildSendFunc('Appointment Rescheduled Notice', 'appt-rescheduled'),
  sendApptDeletedNotice: buildSendFunc('Appointment Deleted Notice', 'appt-deleted'),
  sendEmailChangedNotice: buildSendFunc('Account Email Changed', 'email-changed')
};
