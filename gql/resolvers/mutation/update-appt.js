const { createResolver, or } = require('apollo-resolvers');

const { isOwnApptResolver, willBeOwnApptResolver, isOpOrAdminResolver } = require('../auth');
const { removeEmpty, getApptTypeDetails } = require('../helpers');
const { NoUserInDBError, UpdateApptUserError } = require('../errors');

// check auth
// check if id matches an appointment in the database
// check if target appt details.userEmail matches user.userEmail
// check if new details.userEmail is in users db
// check if new details.userEmail matches user.userEmail, or skip if user.userRole is op/admin
// update appt

const isAndWillBeOwnApptResolver = isOwnApptResolver.createResolver(willBeOwnApptResolver);

// updateAppt(id: ID!, details: UpdateApptInput!): Appointment
const updateAppt = or(isOpOrAdminResolver, isAndWillBeOwnApptResolver)(
  (_, { id, details }, { appts, targetAppt }) => {
    const newTypeDetails = getApptTypeDetails(details); // TODO verify (schema doesn't verify)
    const validFields = ['timeSlot', 'block', 'userEmail', 'type']; // TODO this probably should not be hardcoded, especailly not here
    const fieldsToChange = Object.keys(removeEmpty(details)).filter(key => validFields.includes(key));

    fieldsToChange.forEach(field => targetAppt[field] = details[field]);
    if (newTypeDetails) Object.assign(targetAppt.typeDetails, newTypeDetails);
    appts.update(targetAppt);

    return targetAppt;
  }
);

module.exports = updateAppt;
