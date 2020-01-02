const { sendApptDeletedNotice } = require('../../../messaging/email/send-email');
const { sendApptDeletedSMS } = require('../../../messaging/sms/send-sms');
const logger = require('../../../logging/logger');
const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck } = require('../checks');
const { isOpOrAdmin, getPrettyDateString } = require('../helpers');
const { NotifyNumberSMSSendError } = require('../errors');

// deleteAppt(input: DeleteApptInput!): String
const deleteAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { id } }, { user, User, Appt }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);
    const apptUser = await User.findByPk(targetAppt.userEmail);

    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user);

    if (targetAppt.notifyMobileNumber) {
      const date = getPrettyDateString(targetAppt.timeSlot.date);

      try {
        await sendApptDeletedSMS(targetAppt.notifyMobileNumber, { date, arrivalWindow: targetAppt.arrivalWindow });
      } catch (err) {
        throw new NotifyNumberSMSSendError();
      }
    }

    await targetAppt.destroy();

    if (isOpOrAdmin(user) && targetAppt.userEmail !== user.userEmail) {
      try {
        await sendApptDeletedNotice(apptUser.email, {
          name: apptUser.name,
          date: getPrettyDateString(targetAppt.timeSlot.date),
          arrivalWindow: targetAppt.arrivalWindow
        });
      } catch (err) {
        logger.error(`Delete Appt Notice Failed to Send: ${err.stack}`);
      }
    }

    return 'Appointment deleted successfully';
  }
);

module.exports = deleteAppt;
