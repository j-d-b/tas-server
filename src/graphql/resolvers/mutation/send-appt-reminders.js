const { sendApptReminder } = require('../../../messaging/email/send-email');
const { sendApptReminderSMS } = require('../../../messaging/sms/send-sms');
const { isAdminResolver } = require('../auth');
const { EmailSendError, SMSSendError } = require('../errors');
const { getFirstName, getHourString, getDateString } = require('../helpers');

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
      const user = await appt.getUser({ attributes: ['name', 'reminderSetting', 'email', 'mobileNumber'] });
      const apptDetails = {
        name: getFirstName(user),
        ...appt.toJSON(), // yes, we're giving more than we user
        date: getDateString(appt.timeSlotDate),
        hour: getHourString(appt.timeSlotHour),
        ...appt.typeDetails
      };

      if (appt.notifyMobileNumber) {
        numSMS++;
        try {
          await sendApptReminderSMS(appt.notifyMobileNumber, apptDetails);
        } catch (err) {
          throw new SMSSendError();
        }
        numSentSMS++;
      }

      switch (user.reminderSetting) {
        case 'EMAIL':
          numEmail++;
          try {
            await sendApptReminder(user.email, apptDetails);
          } catch (err) {
            throw new EmailSendError();
          }
          numSentEmail++;
          break;
        case 'SMS':
          numSMS++;
          try {
            await sendApptReminderSMS(user.mobileNumber, apptDetails);
          } catch (err) {
            throw new SMSSendError();
          }
          numSentSMS++;
          break;
        case 'BOTH':
          numSMS++;
          numEmail++;
          try {
            await sendApptReminder(user.email, apptDetails);
          } catch (err) {
            throw new EmailSendError();
          }
          numSentEmail++;
          try {
            await sendApptReminderSMS(user.mobileNumber, apptDetails);
          } catch (err) {
            throw new SMSSendError();
          }
          numSentSMS++;
      }
    }

    return `${numSentEmail}/${numEmail} email and ${numSentSMS}/${numSMS} SMS notification(s) sent successfully.`;
  }
);

module.exports = sendApptReminders;
