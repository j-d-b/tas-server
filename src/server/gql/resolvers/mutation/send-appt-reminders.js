const { sendApptReminder } = require.main.require('./messaging/email/send-email');
const { isAdminResolver } = require('../auth');
const { MailSendError } = require('../errors');
const { getHourString } = require('../helpers');

// sendApptReminders: String
const sendApptReminders = isAdminResolver.createResolver(
  async (_, args, { Appt }) => {
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
      const apptDetails = {
        ...appt.toJSON(), // IDEA yes, we're giving more than we need to...
        date: new Date(Date.parse(appt.timeSlotDate)).toUTCString().substring(0, 16),
        hour: getHourString(appt.timeSlotHour),
        ...appt.typeDetails
      };

      switch (user.reminderSetting) {
        case 'EMAIL':
          numEmail++;
          try {
            await sendApptReminder(user.email, apptDetails);
          } catch (err) {
            throw new MailSendError();
          }
          numSentEmail++;
          break;
        case 'SMS':
          numSMS++;
          console.log('SMS is not yet supported'); // TODO
          break;
        case 'BOTH':
          numSMS++;
          numEmail++;
          try {
            await sendApptReminder(user.email, apptDetails);
          } catch (err) {
            throw new MailSendError();
          }
          numSentEmail++;
          console.log('SMS is not yet supported'); // TODO
      }
    }

    return `${numSentEmail}/${numEmail} email and ${numSentSMS}/${numSMS} SMS notification(s) sent successfully.`;
  }
);

module.exports = sendApptReminders;
