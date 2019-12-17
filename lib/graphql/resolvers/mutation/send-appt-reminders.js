const { Op } = require('sequelize');
const moment = require('moment');

const logger = require('../../../logging/logger');
const { sendApptReminder } = require('../../../messaging/email/send-email');
const { sendApptReminderSMS } = require('../../../messaging/sms/send-sms');
const { isAdminResolver } = require('../auth');
const { getPrettyDateString } = require('../helpers');

// sendApptReminders: String
const sendApptReminders = isAdminResolver.createResolver(
  async (_, args, { Appt }) => {
    const startOfTomorrow = moment().startOf('day').add(1, 'days');
    const endOfTomorrow = moment().endOf('day').add(1, 'days');

    const apptsTomorrow = await Appt.findAll({ 
      where: { 
        timeSlotDateUTC: { 
          [Op.gte]: startOfTomorrow.utc(),
          [Op.lte]: endOfTomorrow.utc()
        }
      } 
    });

    let numEmail = 0;
    let numSMS = 0;
    let numSentEmail = 0;
    let numSentSMS = 0;
    for (const appt of apptsTomorrow) {
      const user = await appt.getUser({ attributes: ['name', 'reminderSetting', 'email', 'mobileNumber'] });
      const apptDetails = {
        name: user.name,
        date: getPrettyDateString(appt.timeSlot.date),
        arrivalWindow: appt.arrivalWindow
      };

      if (appt.notifyMobileNumber) {
        numSMS++;
        try {
          await sendApptReminderSMS(appt.notifyMobileNumber, apptDetails);
        } catch (err) {
          logger.error(`SMS Send Error: ${err.stack}`);
        }
        numSentSMS++;
      }

      switch (user.reminderSetting) {
        case 'EMAIL':
          numEmail++;
          try {
            await sendApptReminder(user.email, apptDetails);
          } catch (err) {
            logger.error(`Email Send Error: ${err.stack}`);
          }
          numSentEmail++;
          break;
        case 'SMS':
          numSMS++;
          try {
            await sendApptReminderSMS(user.mobileNumber, apptDetails);
          } catch (err) {
            logger.error(`SMS Send Error: ${err.stack}`);
          }
          numSentSMS++;
          break;
        case 'BOTH':
          numSMS++;
          numEmail++;
          try {
            await sendApptReminder(user.email, apptDetails);
          } catch (err) {
            logger.error(`Email Send Error: ${err.stack}`);
          }
          numSentEmail++;
          try {
            await sendApptReminderSMS(user.mobileNumber, apptDetails);
          } catch (err) {
            logger.error(`SMS Send Error: ${err.stack}`);
          }
          numSentSMS++;
      }
    }

    return `${numSentEmail}/${numEmail} email and ${numSentSMS}/${numSMS} SMS notification(s) sent successfully.`;
  }
);

module.exports = sendApptReminders;
