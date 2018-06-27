const { createResolver } = require('apollo-resolvers');

const { isUpdateApptOwnEmailResolver } = require('../auth');
const { NoUserInDBError } = require('../../errors');
const { removeEmpty } = require('../../../utils');

// TODO this is in add-appt.js also
function getTypeDetails(apptDetails) {
  switch (apptDetails.type) {
    case 'IMPORTFULL':
      return apptDetails.importFull;
    case 'IMPORTEMPTY':
      return apptDetails.importEmpty;
    case 'EXPORTFULL':
      return apptDetails.exportFull;
    case 'EXPORTEMPTY':
      return apptDetails.exportEmpty;
  }
}

// updateAppt(id: ID!, details: UpdateApptInput!): Appointment
const updateAppt = isUpdateApptOwnEmailResolver.createResolver(
  (_, { id, details }, { appts, users, targetAppt }) => {
    if (!users.by('email', details.userEmail)) throw new NoUserInDBError({ data: { targetUser: details.userEmail }}); // TODO move to auth.js resolver bc DRY

    const newTypeDetails = getTypeDetails(details); // TODO verify (schema doesn't verify)
    const validFields = ['timeSlot', 'block', 'userEmail', 'type']; // TODO this probably should not be hardcoded, especailly not here
    const fieldsToChange = Object.keys(removeEmpty(details)).filter(key => validFields.includes(key));

    fieldsToChange.forEach(field => targetAppt[field] = details[field]);
    if (newTypeDetails) Object.assign(targetAppt.typeDetails, newTypeDetails);
    appts.update(targetAppt);

    return targetAppt;
  }
);

module.exports = updateAppt;
