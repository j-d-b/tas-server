const { format, addMinutes } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');

const { sendApptCreatedSMS } = require('../../../messaging/sms/send-sms');
const { isAuthenticatedResolver } = require('../auth');
const { SMSSendError } = require('../errors');
const { hasTypeSpecificCheck, isAvailableCheck } = require('../checks');
const { getNewApptArrivalWindowDetails, getDateString } = require('../helpers');
const { TIMEZONE } = process.env;

// addAppt(input: AddApptInput!): Appt
const addAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { timeSlot, licensePlateNumber, notifyMobileNumber, comment, actions } }, { user, Appt, Action, Config, Restriction, RestrictionTemplate }) => {
    const { arrivalWindowSlot, arrivalWindowLength } = await getNewApptArrivalWindowDetails(timeSlot, Appt, Action, Config);

    const newActions = await Promise.all(actions.map(async (action) => {
      const typeSpecific = hasTypeSpecificCheck(action);
      if (action.type === 'IMPORT_FULL') typeSpecific.containerSize = 'TWENTYFOOT'; // TODO

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
      const apptDetails = {
        date: getDateString(newAppt.timeSlot.date),
        arrivalWindow: ((appt) => { // NOTE: this is duplicate code to lib/data/models/appt.js setter
          const startTimeUTC = addMinutes(appt.timeSlotDateUTC, appt.arrivalWindowSlot * appt.arrivalWindowLength);
          const endTimeUTC = addMinutes(appt.timeSlotDateUTC, (appt.arrivalWindowSlot + 1) * appt.arrivalWindowLength);
    
          const startTimeZoned = format(utcToZonedTime(startTimeUTC, TIMEZONE), 'HH:mm');
          const endTimeZoned = format(utcToZonedTime(endTimeUTC, TIMEZONE), 'HH:mm');
    
          return `${startTimeZoned} - ${endTimeZoned}`;
        })(newAppt)
      };

      try {
        await sendApptCreatedSMS(notifyMobileNumber, apptDetails);
      } catch (err) {
        throw new SMSSendError();
      }
    }

    const createdAppt = await Appt.create(newAppt);
    await Action.bulkCreate(newActions.map(action => ({ ...action, apptId: createdAppt.id })));
    return createdAppt;
  }
);

module.exports = addAppt;
