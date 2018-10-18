const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck, isAvailableCheck } = require('../checks');
const { buildSlotId, isOpOrAdmin, getNewApptArrivalWindow } = require('../helpers');

// rescheduleAppt(input: RescheduleApptInput!): Appt
const rescheduleAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { id, timeSlot } }, { user, Appt, Block, Config, Restriction }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);

    if (buildSlotId(targetAppt.timeSlot) === buildSlotId({ ...targetAppt.timeSlot, ...timeSlot })) return targetAppt;

    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user); // IDEA: if op/admin, email user if appt was moved
    const linkedAppt = targetAppt.linkedApptId && await Appt.findById(targetAppt.linkedApptId);
    const appts = linkedAppt ? [{ ...targetAppt, timeSlot }, linkedAppt] : [{ ...targetAppt, timeSlot }];
    await isAvailableCheck(appts, Appt, Block, Config, Restriction);

    const newArrivalWindow = await getNewApptArrivalWindow(timeSlot, Appt, Config);

    // IDEA: could have this return an array: both appts if it has a linked appt
    if (linkedAppt) await linkedAppt.update({ timeSlot, ...newArrivalWindow });
    return targetAppt.update({ timeSlot, ...newArrivalWindow });
  }
);

module.exports = rescheduleAppt;
