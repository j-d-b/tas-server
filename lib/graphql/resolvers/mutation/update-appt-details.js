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

      await targetAction.update({ ...typeSpecific });
    }

    const updatedAppt = targetAppt.update({
      ...(comment !== undefined && { comment }),
      ...(notifyMobileNumber !== undefined && { notifyMobileNumber }),
      ...(licensePlateNumber !== undefined && { licensePlateNumber })
    });

    return updatedAppt;
  }
);

module.exports = updateApptDetails;
