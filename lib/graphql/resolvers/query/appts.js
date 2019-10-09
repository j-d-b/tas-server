const { isAuthenticatedResolver } = require('../auth');
const Op = require('sequelize').Op;

// appts(input: ApptsInput!): [Appointment]
const appts = isAuthenticatedResolver.createResolver(
  async (_, { input: { where } }, { Appt, Action }) => {
    if (!where) {
      return Appt.findAll();
    }

    const { timeSlot, userEmail, actionType } = where;

    let actionTypeFilterApptIds;
    if (actionType) {
      const actions = await Action.findAll({ where: { type: actionType } });

      if (actions.length) {
        actionTypeFilterApptIds = [...new Set(actions.map(action => action.apptId))];
      } else {
        return [];
      }
    }

    return Appt.findAll({
      where: { 
        ...(timeSlot && { timeSlotHour: timeSlot.hour, timeSlotDate: timeSlot.date }),
        ...(userEmail && { userEmail }),
        ...(actionType && { id: { [Op.or]: actionTypeFilterApptIds } })
      }
    });
  }
);

module.exports = appts;
