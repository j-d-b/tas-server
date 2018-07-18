const { isAuthenticatedResolver } = require('../auth');
const { removeEmpty, isOpOrAdmin, getApptTypeDetails } = require('../helpers');
const { doesApptExistCheck, isOwnApptCheck, doesUserExistCheck, isUserSelfCheck, isAvailableCheck } = require('../checks');

// updateAppt(id: ID!, details: UpdateApptInput!): Appt
const updateAppt = isAuthenticatedResolver.createResolver(
  (_, { id, details }, { appts, users, blocks, user }) => {
    const targetAppt = doesApptExistCheck(id, appts);

    doesUserExistCheck(details.userEmail, users);

    if (!isOpOrAdmin(user)) {
      isOwnApptCheck(targetAppt, user);
      if (details.userEmail) isUserSelfCheck(details.userEmail, user); // new email must be user's email
    }

    // if changing scheduling time/block
    if (details.timeSlot || details.importFull) {
      isAvailableCheck([{ ...targetAppt, ...details, importFull: { ...targetAppt.typeDetails, ...details.importFull } }], appts, blocks);
    }

    const MUTABLE_FIELDS = ['timeSlot', 'userEmail']; // TODO this probably should not be hardcoded, especially not here
    const fieldsToChange = Object.keys(removeEmpty(details)).filter(key => MUTABLE_FIELDS.includes(key));
    const newTypeDetails = getApptTypeDetails(details);

    fieldsToChange.forEach(field => targetAppt[field] = details[field]);
    if (newTypeDetails) Object.assign(targetAppt.typeDetails, removeEmpty(newTypeDetails));
    appts.update(targetAppt);

    return targetAppt;
  }
);

module.exports = updateAppt;
