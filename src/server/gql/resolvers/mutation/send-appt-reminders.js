const { sendApptReminder } = require.main.require('./messaging/email/sendmail');
const { isAdminResolver } = require('../auth');
const { MailSendError } = require('../errors');

// sendApptReminders: String
const sendApptReminders = isAdminResolver.createResolver(
  async (_, args, { Appt, User }) => {
    const tomorrowISO = (() => {
      const tomorrow = new Date();
      tomorrow.setTime(tomorrow.getTime() + (24 * 60 * 60 * 1000));
      return tomorrow.toISOString().split('T')[0];
    })();

    const apptsTomorrow = await Appt.findAll({ where: { timeSlotDate: tomorrowISO }});

    let numEmail = 0;
    let numSMS = 0;
    let numSentEmail = 0;
    let numSentSMS = 0;
    for (const appt of apptsTomorrow) {
      const user = await appt.getUser({ attributes: ['reminderSetting', 'email'] });

      switch (user.reminderSetting) {
        case 'EMAIL':
          numEmail++;
          try {
            await sendApptReminder(user.email, { type: appt.type, timeSlot: appt.timeSlot });
          } catch (err) {
            throw new MailSendError();
          }
          numSentEmail++;
          break;
        case 'SMS':
          numSMS++;
          console.log('SMS is not yet supported');
          break;
        case 'BOTH':
          numSMS++;
          numEmail++;
          try {
            await sendApptReminder(user.email, { type: appt.type, timeSlot: appt.timeSlot });
          } catch (err) {
            throw new MailSendError();
          }
          numSentEmail++;
          console.log('SMS is not yet supported');
      }
    }

    return `${numSentEmail}/${numEmail} email and ${numSentSMS}/${numSMS} SMS notification(s) sent successfully.`;
  }
);

module.exports = sendApptReminders;
