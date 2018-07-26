const { isAuthenticatedResolver } = require('../auth');
const { removeEmpty, isOpOrAdmin, getApptTypeDetails } = require('../helpers');
const { doesApptExistCheck, isOwnApptCheck, doesUserExistCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');

// updateAppt(id: ID!, details: UpdateApptInput!): Appt
const updateAppt = isAuthenticatedResolver.createResolver(
  async (_, { id, details: { userEmail, timeSlot, ...typeDetails } }, { user, Appt, User, Block, Config }) => {
    const targetAppt = await doesApptExistCheck(id, Appt).then(obj => obj.get({ plain: true }));

    if (userEmail) await doesUserExistCheck(userEmail, User);

    if (!isOpOrAdmin(user)) {
      isOwnApptCheck(targetAppt, user);
      if (userEmail) isUserSelfCheck(userEmail, user); // new email must be user's email
    }

    if (timeSlot) await isAvailableCheck([{ ...targetAppt, timeSlot }], Appt, Block, Config);

    const newTypeDetails = getApptTypeDetails({ type: targetAppt.type, ...typeDetails });
    await Appt.update({ userEmail, timeSlot, typeDetails: { ...newTypeDetails }}, { where: { id } });

    return Appt.findById(id);
  }
);

module.exports = updateAppt;
