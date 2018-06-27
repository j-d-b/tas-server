const { createResolver } = require('apollo-resolvers');
const { createError } = require('apollo-errors');

const { isAuthenticatedResolver, isAddOwnApptResolver, isOwnApptResolver, isUpdateApptOwnEmailResolver } = require('./auth');
const { DBTypeError, NoUserInDBError } = require('../errors');
const { removeEmpty } = require('../../utils');

// queries
const myAppts = isAuthenticatedResolver.createResolver(
  (_, args, { appts, user }) => appts.find({ userEmail: user.userEmail })
);

const appt = isAuthenticatedResolver.createResolver(
  (_, { id }, { appts }) => appts.get(id)
);

const appts = isAuthenticatedResolver.createResolver(
  (_, { where }, { appts }) => appts.find(removeEmpty(where))
);

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
  Query: {
    myAppts,
    appt,
    appts
  },
  Mutation: {
    addAppt,
    updateAppt,
    deleteAppt
  },
  Appointment: { //
    id: appt => appt.$loki, // uses $loki for id <- TODO assess this
    user: (appt, args, { users }) => users.by('email', appt.userEmail),
    typeDetails: appt => {
      switch (appt.type) {
        case 'IMPORTFULL':
          return {
            containerID: appt.typeDetails.containerID,
            formNumber705: appt.typeDetails.formNumber705
          }
        case 'IMPORTEMPTY':
          return {
            containerSize: appt.typeDetails.containerSize,
            emptyForCityFormNum: appt.typeDetails.emptyForCityFormNum
          }
        case 'EXPORTFULL':
          return {
            containerID: appt.typeDetails.containerID,
            containerSize: appt.typeDetails.containerSize,
            containerWeight: appt.typeDetails.containerWeight,
            bookingNum: appt.typeDetails.bookingNum,
            vesselName: appt.typeDetails.vesselName,
            vesselETA: appt.typeDetails.vesselETA,
            destinationPort: appt.typeDetails.desintationPort,
            firstPortOfDischarge: appt.typeDetails.firstPortOfDischarge
          }
        case 'EXPORTEMPTY':
          return {
            containerID: appt.typeDetails.containerID,
            containerSize: appt.typeDetails.containerSize
          }
        default:
          throw new DBTypeError();
      }
    }
  }
};
