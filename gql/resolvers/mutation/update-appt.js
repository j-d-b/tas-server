const { createResolver } = require('apollo-resolvers');

const { isAuthenticatedResolver } = require('../auth');
const { removeEmpty, getApptTypeDetails, isOpOrAdmin } = require('../helpers');
const { doesApptExistCheck, isOwnApptCheck, doesUserExistCheck, isUserSelfCheck } = require('../checks');

// check auth
// check if id matches an appointment in the database
// check if new details.userEmail is in users db
// check if target appt details.userEmail matches user.userEmail or skip if user.userRole is op/admin
// check if new details.userEmail matches user.userEmail, or skip if user.userRole is op/admin
// update appt

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
    const newTypeDetails = getApptTypeDetails(details); // TODO verify (schema doesn't verify)

    fieldsToChange.forEach(field => targetAppt[field] = details[field]);
    if (newTypeDetails) Object.assign(targetAppt.typeDetails, newTypeDetails);
    appts.update(targetAppt);

    return targetAppt;
  }
);

module.exports = updateAppt;
