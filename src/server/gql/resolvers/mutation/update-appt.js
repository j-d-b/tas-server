const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck, doesUserExistCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');
const { isOpOrAdmin, getContainerBlockId, getApptTypeDetails, getNewApptArrivalWindow } = require('../helpers');

// updateAppt(id: ID!, details: UpdateApptInput!): Appt
const updateAppt = isAuthenticatedResolver.createResolver(
  async (_, { id, details: { userEmail, timeSlot, ...typeDetails } }, { user, Appt, Block, Config, User, Restriction }) => {
    const targetAppt = await doesApptExistCheck(id, Appt).then(obj => obj.get({ plain: true }));
    const newTypeDetails = getApptTypeDetails({ type: targetAppt.type, ...typeDetails });

    if (userEmail) await doesUserExistCheck(userEmail, User);

    if (!isOpOrAdmin(user)) { // IDEA if op/admin, email user if appt was changed
      isOwnApptCheck(targetAppt, user);
      if (userEmail) isUserSelfCheck(userEmail, user); // new email must be user's email
    }

    const { vesselName, vesselETA, bookingNum, shippingLine } = newTypeDetails;
    let blockId;

    let arrivalWindowSlot = targetAppt.arrivalWindowSlot;
    let arrivalWindowLength = targetAppt.arrivalWindowLength;
    if (timeSlot || vesselName || vesselETA || bookingNum || shippingLine) { // fields with potential to change appt slot
      if (vesselName || vesselETA || bookingNum || shippingLine) { // potential block change
        blockId = getContainerBlockId(targetAppt.type, { ...targetAppt.typeDetails, ...newTypeDetails });
      }
      await isAvailableCheck([{ ...targetAppt, ...(blockId && { blockId }), timeSlot }], Appt, Block, Config, Restriction);

      const newArrivalWindow = await getNewApptArrivalWindow(timeSlot, Appt, Config);
      arrivalWindowSlot = newArrivalWindow.arrivalWindowSlot;
      arrivalWindowLength = newArrivalWindow.arrivalWindowLength;
    }

    await Appt.update({ userEmail, timeSlot, ...(blockId && { blockId }), arrivalWindowSlot, arrivalWindowLength, typeDetails: { ...targetAppt.typeDetails, ...newTypeDetails }}, { where: { id } });

    return Appt.findById(id);
  }
);

module.exports = updateAppt;
