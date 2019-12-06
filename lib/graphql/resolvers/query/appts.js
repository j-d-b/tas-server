const Op = require('sequelize').Op;
const { startOfDay, addDays } = require('date-fns');

const { isAuthenticatedResolver } = require('../auth');
const { TooManyAppointmentsError } = require('../errors');

// appts(input: ApptsInput!): [Appointment]
const appts = isAuthenticatedResolver.createResolver(
  async (_, { input: { startDate, endDate, where = {} } }, { Appt, Action, Config }) => {
    const { userEmail, actionType } = where;

    let actionTypeFilterApptIds;
    if (actionType) {
      const actions = await Action.findAll({ where: { type: actionType } });

      if (actions.length) {
        actionTypeFilterApptIds = [...new Set(actions.map(action => action.apptId))];
      } else {
        return [];
      }
    }

    const config = await Config.findOne();

    const options = {
      where: { 
        ...((startDate || endDate) && { 
          timeSlotDate: {
            ...(startDate && { [Op.gt]: startOfDay(new Date(startDate)) }),
            ...(endDate && { [Op.lte]: startOfDay(addDays(new Date(endDate), 1)) })
          }
        }),
        ...(userEmail && { userEmail }),
        ...(actionType && { id: { [Op.or]: actionTypeFilterApptIds } })
      },
      limit: config.apptsQueryMaxCount + 1
    };

    const { count, rows } = await Appt.findAndCountAll(options);

    if (count > config.apptsQueryMaxCount) throw new TooManyAppointmentsError();

    return rows;
  }
);

module.exports = appts;
