const Op = require('sequelize').Op;
const moment = require('moment-timezone');

const { getHourString } = require('../helpers');
const { isAuthenticatedResolver } = require('../auth');
const { TooManyAppointmentsError } = require('../errors');
const { TIMEZONE } = process.env;

// appts(input: ApptsInput!): [Appointment]
const appts = isAuthenticatedResolver.createResolver(
  async (_, { input: { fromTimeSlot, toTimeSlot, where = {} } }, { Appt, Action, Config }) => {
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
        ...((fromTimeSlot || toTimeSlot) && { 
          timeSlotDateUTC: {
            ...(fromTimeSlot && { [Op.gte]: moment.tz(`${fromTimeSlot.date} ${getHourString(fromTimeSlot.hour)}:00`, TIMEZONE) }),
            ...(toTimeSlot && { [Op.lte]: moment.tz(`${toTimeSlot.date} ${getHourString(toTimeSlot.hour)}:00`, TIMEZONE) })
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
