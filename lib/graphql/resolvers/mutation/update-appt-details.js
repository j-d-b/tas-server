const { getContainerBlockId, getContainerSize } = require('../../../terminal-connection');
const logger = require('../../../logging/logger');
const { sendApptUpdatedNotice } = require('../../../messaging/email/send-email');
const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck, hasTypeSpecificCheck } = require('../checks');
const { isOpOrAdmin, getFirstName, getDateString } = require('../helpers');
const { NotChildActionError } = require('../errors');

// updateApptDetails(input: UpdateApptDetailsInput!): Appt
const updateApptDetails = isAuthenticatedResolver.createResolver(
  async (_, { input: { id, comment, actionDetails } }, { user, Action, Appt, User }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);
    const actions = await Action.findAll({ where: { apptId: id } });
    const actionIds = actions.map(action => action.id);

    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user);

    for (const action of actionDetails) {
      if (!actionIds.includes(action.id)) throw new NotChildActionError();
      const targetAction = actions.find(a => a.id === action.id);
      const typeSpecific = hasTypeSpecificCheck({ type: targetAction.type, ...action });
      const blockId = await getContainerBlockId(targetAction.type, typeSpecific);
      if (action.type === 'IMPORT_FULL') typeSpecific.containerSize = await getContainerSize(action.type, typeSpecific);

      await targetAction.update({ blockId, ...typeSpecific });
    }

    const updatedAppt = comment ? targetAppt.update({ comment }) : targetAppt;

    // TODO send mail
    // if (isOpOrAdmin(user)) {
    //   try {
    //     await sendApptUpdatedNotice(targetAppt.userEmail, {
    //       actions.toJSON(),
    //       newDetails: { ...inputTypeDetails },
    //       name: getFirstName(await User.findById(targetAppt.userEmail)),
    //       date: getDateString(targetAppt.timeSlotDate),
    //       arrivalWindow: targetAppt.arrivalWindow
    //     });
    //   } catch (err) {
    //     logger.error(`Updated Appt Notice Failed to Send: ${err.stack}`);
    //   }
    // }

    return updatedAppt;
  }
);

module.exports = updateApptDetails;
