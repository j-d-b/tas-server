const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck, isAvailableCheck } = require('../checks');
const { buildSlotId, isOpOrAdmin, getNewApptArrivalWindow } = require('../helpers');

// rescheduleAppt(input: RescheduleApptInput!): Appt
const rescheduleAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { id, timeSlot } }, { user, Appt, Block, Config, Restriction }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);

    if (buildSlotId(targetAppt.timeSlot) === buildSlotId({ ...targetAppt.timeSlot, ...timeSlot })) return targetAppt;

    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user); // IDEA: if op/admin, email user if appt was moved
    await isAvailableCheck([{ ...targetAppt, timeSlot }], Appt, Block, Config, Restriction);

    const newArrivalWindow = await getNewApptArrivalWindow(timeSlot, Appt, Config);

    return targetAppt.update({ timeSlot, ...newArrivalWindow });
  }
);

module.exports = rescheduleAppt;
