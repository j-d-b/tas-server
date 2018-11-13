const { getContainerBlockId, getContainerSize } = require('../../../terminal-connection');
const { sendApptCreatedSMS } = require('../../../messaging/sms/send-sms');
const { isAuthenticatedResolver } = require('../auth');
const { SMSSendError } = require('../errors');
const { hasTypeDetailsCheck, isAvailableCheck } = require('../checks');
const { getNewApptArrivalWindow } = require('../helpers');

// addAppt(input: AddApptInput!): Appt
const addAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { timeSlot, type, licensePlateNumber, notifyMobileNumber, ...typeSpecific } }, { user, Appt, Block, Config, Restriction }) => {
    const { arrivalWindowSlot, arrivalWindowLength } = await getNewApptArrivalWindow(timeSlot, Appt, Config);

    const typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific });
    if (type === 'IMPORT_FULL') typeDetails.containerSize = await getContainerSize(type, typeDetails);

    const blockId = await getContainerBlockId(type, typeDetails);
    const newAppt = {
      timeSlot,
      userEmail: user.userEmail,
      blockId,
      arrivalWindowSlot,
      arrivalWindowLength,
      licensePlateNumber,
      notifyMobileNumber,
      type,
      typeDetails
    };

    await isAvailableCheck([newAppt], Appt, Block, Config, Restriction); // appt scheduling logic

    if (notifyMobileNumber) {
      const apptDetails = {
        date: new Date(Date.parse(newAppt.timeSlot.date)).toUTCString().substring(0, 16),
        arrivalWindow: ((appt) => { // NOTE: this is duplicate code to src/data/models/appt.js setter
          const startHour = appt.timeSlot.hour < 10 ? `0${appt.timeSlot.hour}` : appt.timeSlot.hour;
          let endHour = startHour;

          let startMinutes = appt.arrivalWindowSlot * appt.arrivalWindowLength;
          if (startMinutes < 10) startMinutes = '0' + startMinutes;

          let endMinutes = (appt.arrivalWindowSlot + 1) * appt.arrivalWindowLength;
          if (endMinutes < 10) endMinutes = '0' + endMinutes;
          else if (endMinutes === 60) {
            endMinutes = '00';
            endHour = new Date(Date.parse(`${appt.timeSlot.date}T${startHour}:00:00Z`));
            endHour.setTime(endHour.getTime() + (60 * 60 * 1000));
            endHour = endHour.toISOString().split('T')[1].substring(0, 2);
          }

          return `${startHour}:${startMinutes} - ${endHour}:${endMinutes}`;
        })(newAppt)
      };

      try {
        await sendApptCreatedSMS(notifyMobileNumber, apptDetails);
      } catch (err) {
        throw new SMSSendError();
      }
    }

    return Appt.create(newAppt);
  }
);

module.exports = addAppt;
