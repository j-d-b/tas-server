const Op = require('sequelize').Op;
const { startOfDay, addDays } = require('date-fns');

const { isAuthenticatedResolver } = require('../auth');

// appts(input: ApptsInput!): [Appointment]
const appts = isAuthenticatedResolver.createResolver(
  async (_, { input: { startDate, endDate, where = {} } }, { Appt, Action }) => {
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
        ...(timeSlot 
          ? { timeSlotHour: timeSlot.hour, timeSlotDate: timeSlot.date }
          : { 
            timeSlotDate: {
              ...(startDate && { [Op.gt]: startOfDay(new Date(startDate)) }),
              ...(endDate && { [Op.lte]: startOfDay(addDays(new Date(endDate), 1)) })
            }
          }
        ),
        ...(userEmail && { userEmail }),
        ...(actionType && { id: { [Op.or]: actionTypeFilterApptIds } })
      }
    });
  }
);

module.exports = appts;
