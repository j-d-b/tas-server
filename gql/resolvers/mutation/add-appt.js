const { createResolver } = require('apollo-resolvers');

const { isAddOwnApptResolver } = require('../auth');
const { NoUserInDBError } = require('../../errors');

// TODO this in in update-appt.js as well
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

// addAppt(details: AddApptInput!): Appointment
const addAppt = isAddOwnApptResolver.createResolver(
  (_, { details }, { appts, users }) => {
    if (!users.by('email', details.userEmail)) throw new NoUserInDBError({ data: { targetUser: details.userEmail }}); // TODO move to auth.js resolver bc DRY

    return appts.insert({
      timeSlot: details.timeSlot,
      block: details.block,
      userEmail: details.userEmail,
      type: details.type,
      typeDetails: getTypeDetails(details) // TODO verify (schema doesn't verify)
    });
  }
);

module.exports = addAppt;
