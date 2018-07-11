const { isAuthenticatedResolver } = require('../auth');
const { removeEmpty, isOpOrAdmin, getApptTypeDetails } = require('../helpers');
const { doesApptExistCheck, isOwnApptCheck, doesUserExistCheck, isUserSelfCheck } = require('../checks');

// updateAppt(id: ID!, details: UpdateApptInput!): Appointment
const updateAppt = isAuthenticatedResolver.createResolver(
  (_, { id, details }, { appts, users, user }) => {
    const targetAppt = doesApptExistCheck(id, appts);

    doesUserExistCheck(details.userEmail, users); // new email must match a user

    if (!isOpOrAdmin(user)) {
      isOwnApptCheck(targetAppt, user);
      isUserSelfCheck(details.userEmail, user); // new email must be user's email
    }

    const mutableFields = ['timeSlot', 'block', 'userEmail', 'type']; // TODO this probably should not be hardcoded, especially not here
    const fieldsToChange = Object.keys(removeEmpty(details)).filter(key => mutableFields.includes(key));
    const newTypeDetails = getApptTypeDetails(details);

    fieldsToChange.forEach(field => targetAppt[field] = details[field]);
    if (newTypeDetails) Object.assign(targetAppt.typeDetails, removeEmpty(newTypeDetails));
    appts.update(targetAppt);

    return targetAppt;
  }
);

module.exports = updateAppt;
