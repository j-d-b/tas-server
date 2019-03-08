const { sendApptRescheduledNotice } = require('../../../messaging/email/send-email');
const logger = require('../../../logging/logger');
const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck, isAvailableCheck } = require('../checks');
const { buildSlotId, isOpOrAdmin, getNewApptArrivalWindow, getFirstName, getDateString } = require('../helpers');

// rescheduleAppt(input: RescheduleApptInput!): Appt
const rescheduleAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { id, timeSlot } }, { user, Action, Appt, Block, Config, User, Restriction }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);
    const actions = await Action.findAll({ where: { apptId: targetAppt.id } });
    const oldTimeSlot = targetAppt.timeSlot;
    const oldArrivalWindow = targetAppt.arrivalWindow;

    if (buildSlotId(targetAppt.timeSlot) === buildSlotId({ ...targetAppt.timeSlot, ...timeSlot })) return targetAppt;

    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user);
    await isAvailableCheck({ ...targetAppt, timeSlot }, actions, Action, Appt, Block, Config, Restriction);

    const newArrivalWindow = await getNewApptArrivalWindow(timeSlot, Appt, Action, Config);
    await targetAppt.update({ timeSlot, ...newArrivalWindow });

    if (isOpOrAdmin(user)) {
      try {
        await sendApptRescheduledNotice(targetAppt.userEmail, {
          name: getFirstName(await User.findById(targetAppt.userEmail)),
          oldDate: getDateString(oldTimeSlot.date),
          oldArrivalWindow,
          newDate: getDateString(targetAppt.timeSlotDate),
          newArrivalWindow: targetAppt.arrivalWindow
        });
      } catch (err) {
        logger.error(`Reschedule Appt Notice email failed to send: ${err.stack}`);
      }
    }

    return targetAppt; // TODO verify this returns the updated appt
  }
);

module.exports = rescheduleAppt;
