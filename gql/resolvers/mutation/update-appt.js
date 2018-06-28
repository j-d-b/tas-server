const { createResolver, and } = require('apollo-resolvers');

const { isOwnApptResolver, doesApptUserExistResolver } = require('../auth');
const { removeEmpty, getApptTypeDetails } = require('../helpers');
const { NoUserInDBError, UpdateApptUserError } = require('../errors');

// TODO consider removing this complexity by not allowing the appt user to be manually set on update
const isUpdateApptOwnEmailResolver = and(isOwnApptResolver, doesApptUserExistResolver)(
  (_, { details: { userEmail } }, { targetAppt, user }) => {
    if (userEmail && userEmail !== targetAppt.userEmail && !isOpOrAdmin(user.userRole)) throw new UpdateApptUserError(); // TODO apollo errorize
  }
);

// updateAppt(id: ID!, details: UpdateApptInput!): Appointment
const updateAppt = isUpdateApptOwnEmailResolver.createResolver(
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
