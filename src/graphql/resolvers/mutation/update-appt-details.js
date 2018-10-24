const { getContainerBlockId } = require('../../../terminal-connection');
const logger = require('../../../logging/logger');
const { sendApptUpdatedNotice } = require('../../../messaging/email/send-email');
const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck } = require('../checks');
const { isOpOrAdmin, getApptTypeDetails, getFirstName, getDateString } = require('../helpers');

// updateApptDetails(input: UpdateApptDetailsInput!): Appt
const updateApptDetails = isAuthenticatedResolver.createResolver(
  async (_, { input: { id, ...typeDetails } }, { user, Appt, User }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);
    const oldDetails = targetAppt.toJSON();

    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user);

    const inputTypeDetails = getApptTypeDetails({ type: targetAppt.type, ...typeDetails });
    const { containerId, bookingNum, shippingLine } = inputTypeDetails;
    const newTypeDetails = { ...targetAppt.typeDetails, ...inputTypeDetails };

    // fields with potential to change block
    const blockId = (containerId || bookingNum || shippingLine) && getContainerBlockId(targetAppt.type, newTypeDetails);

    const updatedAppt = targetAppt.update({ ...(blockId && { blockId }), typeDetails: newTypeDetails });

    if (isOpOrAdmin(user)) {
      try {
        await sendApptUpdatedNotice(targetAppt.userEmail, {
          oldDetails,
          newDetails: { ...inputTypeDetails },
          name: getFirstName(await User.findById(targetAppt.userEmail)),
          date: getDateString(targetAppt.timeSlotDate),
          arrivalWindow: targetAppt.arrivalWindow,
          type: targetAppt.type
        });
      } catch (err) {
        logger.error(`Updated Appt Notice Failed to Send: ${err.stack}`);
      }
    }
    return updatedAppt;
  }
);

module.exports = updateApptDetails;
