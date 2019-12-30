const moment = require('moment-timezone');

const { sendApptCreatedSMS } = require('../../../messaging/sms/send-sms');
const { NotifyNumberSMSSendError } = require('../errors');
const { isAuthenticatedResolver } = require('../auth');
const { hasTypeSpecificCheck, isAvailableCheck } = require('../checks');
const { getNewApptArrivalWindowDetails, getPrettyDateString } = require('../helpers');

// addAppt(input: AddApptInput!): Appt
const addAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { timeSlot, licensePlateNumber, notifyMobileNumber, comment, actions } }, { user, Appt, Action, Config, Restriction, RestrictionTemplate }) => {
    const { arrivalWindowSlot, arrivalWindowLength } = await getNewApptArrivalWindowDetails(timeSlot, Appt, Action, Config);

    const newActions = await Promise.all(actions.map(async (action) => {
      const typeSpecific = hasTypeSpecificCheck(action);

      return {
        type: action.type,
        ...typeSpecific
      };
    }));

    const newAppt = {
      timeSlot,
      userEmail: user.userEmail,
      arrivalWindowSlot,
      arrivalWindowLength,
      licensePlateNumber,
      notifyMobileNumber,
      comment
    };

    await isAvailableCheck(newAppt.timeSlot, Action, Appt, Config, Restriction, RestrictionTemplate); // appt scheduling logic

    if (notifyMobileNumber) {
      const date = getPrettyDateString(newAppt.timeSlot.date);
      const arrivalWindow = ((appt) => {
        const getHourString = hourVal => hourVal < 10 ? `0${hourVal}:00` : `${hourVal}:00`;
        const apptDate = `${newAppt.timeSlot.date} ${getHourString(newAppt.timeSlot.hour)}:00`;
        const startDate = moment(apptDate).add(appt.arrivalWindowSlot * appt.arrivalWindowLength, 'minutes');
        const endDate = moment(apptDate).add((appt.arrivalWindowSlot + 1) * appt.arrivalWindowLength, 'minutes');
        return `${startDate.format('HH:mm')} - ${endDate.format('HH:mm')}`;
      })(newAppt);

      try {
        await sendApptCreatedSMS(notifyMobileNumber, { date, arrivalWindow });
      } catch (err) {
        throw new NotifyNumberSMSSendError();
      }
    }

    const createdAppt = await Appt.create(newAppt);
    await Action.bulkCreate(newActions.map(action => ({ ...action, apptId: createdAppt.id })));
    return createdAppt;
  }
);

module.exports = addAppt;
