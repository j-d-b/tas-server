const { createResolver } = require('apollo-resolvers');
const { createError } = require('apollo-errors');

const { isAddOwnApptResolver, isOwnApptResolver, isUpdateApptOwnEmailResolver } = require('./auth');
const { DBTypeError, NoUserInDBError } = require('../errors');
const { removeEmpty } = require('../../utils');

// mutations
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

const deleteAppt = isOwnApptResolver.createResolver(
  (_, args, { appts, targetAppt }) => {
    appts.remove(targetAppt);
    return 'Appointment deleted successfully';
  }
);

module.exports = {
  Mutation: {
    addAppt,
    updateAppt,
    deleteAppt
  },

};
