const { getContainerBlockId } = require('../../../terminal-connection');
const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck, isAvailableCheck } = require('../checks');
const { isOpOrAdmin, getApptTypeDetails, getNewApptArrivalWindow } = require('../helpers');

// updateAppt(input: UpdateApptInput!): Appt
const updateAppt = isAuthenticatedResolver.createResolver(
  async (_, { input: { id, timeSlot, ...typeDetails } }, { user, Appt, Block, Config, Restriction }) => {
    const targetAppt = await doesApptExistCheck(id, Appt);
    const newTypeDetails = getApptTypeDetails({ type: targetAppt.type, ...typeDetails });

    // IDEA: if op/admin, email user if appt was changed
    if (!isOpOrAdmin(user)) isOwnApptCheck(targetAppt, user);

    const { vesselName, vesselETA, bookingNum, shippingLine } = newTypeDetails;

    let blockID;
    let arrivalWindowSlot = targetAppt.arrivalWindowSlot;
    let arrivalWindowLength = targetAppt.arrivalWindowLength;
    if (timeSlot || vesselName || vesselETA || bookingNum || shippingLine) { // fields with potential to change appt slot
      if (vesselName || vesselETA || bookingNum || shippingLine) { // potential block change
        blockID = getContainerBlockId(targetAppt.type, { ...targetAppt.typeDetails, ...newTypeDetails });
      }
      await isAvailableCheck([{ ...targetAppt, ...(blockID && { blockID }), timeSlot }], Appt, Block, Config, Restriction);

      const newArrivalWindow = await getNewApptArrivalWindow(timeSlot, Appt, Config);
      arrivalWindowSlot = newArrivalWindow.arrivalWindowSlot;
      arrivalWindowLength = newArrivalWindow.arrivalWindowLength;
    }

    return targetAppt.update({
      timeSlot,
      ...(blockID && { blockID }),
      arrivalWindowSlot,
      arrivalWindowLength,
      typeDetails: { ...targetAppt.typeDetails, ...newTypeDetails }
    });
  }
);

module.exports = updateAppt;
