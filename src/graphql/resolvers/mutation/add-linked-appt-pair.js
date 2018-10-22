const { getContainerBlockId, getContainerSize } = require('../../../terminal-connection/');
const { sendApptCreatedSMS } = require('../../../messaging/sms/send-sms');
const { isAuthenticatedResolver } = require('../auth');
const { SMSSendError } = require('../errors');
const { areBothTwentyFootCheck, hasTypeDetailsCheck, isAvailableCheck } = require('../checks');
const { getNewApptArrivalWindow } = require('../helpers');

// addLinkedApptPair(input: AddLinkedApptPairInput!): [Appt]
const addLinkedApptPair = isAuthenticatedResolver.createResolver(
  async (_, { input: { apptOne, apptTwo, ...shared } }, { user: { userEmail }, Appt, Block, Config, Restriction }) => {
    const { arrivalWindowSlot, arrivalWindowLength } = await getNewApptArrivalWindow(shared.timeSlot, Appt, Config);
    const bothAppts = [{ ...apptOne, ...shared }, { ...apptTwo, ...shared }];

    const newAppts = await Promise.all(bothAppts.map(async ({ timeSlot, type, ...typeSpecific }) => {
      const typeDetails = hasTypeDetailsCheck({ type, ...typeSpecific }); // schema doesn't verify this

      if (type === 'IMPORTFULL') typeDetails.containerSize = await getContainerSize(typeDetails.containerId);
      const blockId = await getContainerBlockId(type, typeDetails);

      return { timeSlot, userEmail, arrivalWindowSlot, blockId, arrivalWindowLength, type, typeDetails };
    }));

    areBothTwentyFootCheck(newAppts[0], newAppts[1]);
    await isAvailableCheck(newAppts, Appt, Block, Config, Restriction); // appt scheduling logic

    if (shared.notifyMobileNumber) {
      const apptDetails = {
        date: new Date(Date.parse(newAppts[0].timeSlot.date)).toUTCString().substring(0, 16),
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
        })(newAppts[0])
      };

      try {
        await sendApptCreatedSMS(shared.notifyMobileNumber, apptDetails);
      } catch (err) {
        throw new SMSSendError();
      }
    }

    // NOTE: these arrays will always be a length of 2, but it's general for the future
    const insertedAppts = await Promise.all(newAppts.map(async newAppt => Appt.create(newAppt)));
    const insertedApptIds = insertedAppts.map(appt => appt.id);

    return Promise.all(insertedAppts.map(async (appt) => {
      const linkedApptIds = insertedApptIds.filter(id => id !== appt.id);
      return appt.update({ linkedApptId: linkedApptIds[0] });
    }));
  }
);
// While many of this is general (arrays), in lines 21 and 30,
// we're taking advanage of that it's always only one linked (array length 2).
// If we could put an array easily in the database, I would,
// but I didn't want to make another table just for the linked appts since in TAS v1
// you can only have one linked appt anyways.

module.exports = addLinkedApptPair;
