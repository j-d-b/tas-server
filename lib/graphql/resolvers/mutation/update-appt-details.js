const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck, hasTypeSpecificCheck } = require('../checks');
const { isOpOrAdmin } = require('../helpers');
const { NotChildActionError } = require('../errors');

// updateApptDetails(input: UpdateApptDetailsInput!): Appt
const updateApptDetails = isAuthenticatedResolver.createResolver(
  async (_, { input: { id, comment, notifyMobileNumber, licensePlateNumber, actionDetails } }, { user, Action, Appt }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);
    const actions = await Action.findAll({ where: { apptId: id } });
    const actionIds = actions.map(action => action.id);

    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user);

    for (const action of actionDetails) {
      if (!actionIds.includes(action.id)) throw new NotChildActionError();

      const targetAction = actions.find(a => a.id === action.id);

      const typeSpecific = hasTypeSpecificCheck({ type: targetAction.type, ...action });
      if (action.type === 'IMPORT_FULL') typeSpecific.containerSize = 'TWENTYFOOT'; // TODO container size for import full

      await targetAction.update({ ...typeSpecific });
    }

    const updatedAppt = targetAppt.update({
      ...(comment && { comment }),
      ...(notifyMobileNumber && { notifyMobileNumber }),
      ...(licensePlateNumber && { licensePlateNumber })
    });

    return updatedAppt;
  }
);

module.exports = updateApptDetails;
