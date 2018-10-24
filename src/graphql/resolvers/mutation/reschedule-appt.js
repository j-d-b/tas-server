const { sendApptRescheduledNotice } = require('../../../messaging/email/send-email');
const logger = require('../../../logging/logger');
const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck, isAvailableCheck } = require('../checks');
const { buildSlotId, isOpOrAdmin, getNewApptArrivalWindow, getFirstName, getDateString } = require('../helpers');

// rescheduleAppt(input: RescheduleApptInput!): Appt
const rescheduleAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { id, timeSlot } }, { user, Appt, Block, Config, User, Restriction }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);
    const oldTimeSlot = targetAppt.timeSlot;
    const oldArrivalWindow = targetAppt.arrivalWindow;

    if (buildSlotId(targetAppt.timeSlot) === buildSlotId({ ...targetAppt.timeSlot, ...timeSlot })) return targetAppt;

    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user);
    const linkedAppt = targetAppt.linkedApptId && await Appt.findById(targetAppt.linkedApptId);
    const appts = linkedAppt ? [{ ...targetAppt, timeSlot }, linkedAppt] : [{ ...targetAppt, timeSlot }];
    await isAvailableCheck(appts, Appt, Block, Config, Restriction);

    const newArrivalWindow = await getNewApptArrivalWindow(timeSlot, Appt, Config);

    // IDEA: could have this return an array: both appts if it has a linked appt
    if (linkedAppt) await linkedAppt.update({ timeSlot, ...newArrivalWindow });
    await targetAppt.update({ timeSlot, ...newArrivalWindow });

    if (isOpOrAdmin(user)) {
      try {
        await sendApptRescheduledNotice(targetAppt.userEmail, {
          name: getFirstName(await User.findById(targetAppt.userEmail)),
          oldDate: getDateString(oldTimeSlot.date),
          oldArrivalWindow,
          newDate: getDateString(targetAppt.timeSlotDate),
          newArrivalWindow: targetAppt.arrivalWindow,
          type: targetAppt.type,
          ...(linkedAppt && { linkedAppt: { type: linkedAppt.type } })
        });
      } catch (err) {
        logger.error(`Reschedule Appt Notice failed to send: ${err.stack}`);
      }
    }

    return targetAppt;
  }
);

module.exports = rescheduleAppt;
