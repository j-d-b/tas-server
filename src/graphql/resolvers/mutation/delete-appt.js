const { sendApptDeletedNotice } = require('../../../messaging/email/send-email');
const logger = require('../../../logging/logger');
const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck } = require('../checks');
const { isOpOrAdmin, getFirstName, getDateString } = require('../helpers');

// deleteAppt(input: DeleteApptInput!): String
const deleteAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { id } }, { user, User, Appt }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);
    const apptUser = await User.findById(targetAppt.userEmail);
    const apptDetails = targetAppt.toJSON();

    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user);

    const linkedAppt = targetAppt.linkedApptId && await Appt.findById(targetAppt.linkedApptId);
    const linkedApptType = linkedAppt && linkedAppt.type;

    await targetAppt.destroy();
    if (linkedAppt) await linkedAppt.destroy();

    if (isOpOrAdmin(user)) {
      try {
        await sendApptDeletedNotice(apptUser.email, {
          name: getFirstName(apptUser),
          date: getDateString(apptDetails.timeSlot.date),
          type: apptDetails.type,
          arrivalWindow: apptDetails.arrivalWindow,
          ...(linkedApptType && { linkedAppt: { type: linkedApptType } })
        });
      } catch (err) {
        logger.error(`Delete Appt Notice Failed to Send: ${err.stack}`);
      }
    }

    return 'Appointment deleted successfully';
  }
);

module.exports = deleteAppt;
