const { isAuthenticatedResolver } = require('../auth');
const { doesApptExistCheck, isOwnApptCheck, doesUserExistCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');
const { isOpOrAdmin, getApptTypeDetails, getNewApptArrivalWindow } = require('../helpers');

// updateAppt(id: ID!, details: UpdateApptInput!): Appt
const updateAppt = isAuthenticatedResolver.createResolver(
  async (_, { id, details: { userEmail, timeSlot, ...typeDetails } }, { user, Appt, Block, Config, User, Restriction }) => {
    const targetAppt = await doesApptExistCheck(id, Appt).then(obj => obj.get({ plain: true }));

    if (userEmail) await doesUserExistCheck(userEmail, User);

    if (!isOpOrAdmin(user)) { // IDEA if op/admin, email user if appt was changed
      isOwnApptCheck(targetAppt, user);
      if (userEmail) isUserSelfCheck(userEmail, user); // new email must be user's email
    }

    let arrivalWindowSlot = targetAppt.arrivalWindowSlot;
    let arrivalWindowLength = targetAppt.arrivalWindowLength;
    if (timeSlot) {
      await isAvailableCheck([{ ...targetAppt, timeSlot }], Appt, Block, Config, Restriction);

      const newArrivalWindow = await getNewApptArrivalWindow(timeSlot, Appt, Config);
      arrivalWindowSlot = newArrivalWindow.arrivalWindowSlot;
      arrivalWindowLength = newArrivalWindow.arrivalWindowLength;
    }

    const newTypeDetails = getApptTypeDetails({ type: targetAppt.type, ...typeDetails });
    await Appt.update({ userEmail, timeSlot, arrivalWindowSlot, arrivalWindowLength, typeDetails: { ...newTypeDetails }}, { where: { id } });

    return Appt.findById(id);
  }
);

module.exports = updateAppt;
