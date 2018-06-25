const { createResolver } = require('apollo-resolvers');
const { createError } = require('apollo-errors');

const {
  isAuthenticatedResolver,
  hasOperatorPermissionsResolver,
  isAdminResolver,
  isAddOwnApptResolver,
  isOwnApptResolver
} = require('./auth');
const { removeEmpty } = require('../../utils');
const { DBTypeError } = require('../errors');

// queries
const myAppts = isAuthenticatedResolver.createResolver(
  (_, args, { users, user }) => appts.find({ userEmail: user.email })
);

const appt = isAuthenticatedResolver.createResolver(
  (_, { id }, { appts }) => appts.get(id)
);

const appts = isAuthenticatedResolver.createResolver(
  (_, { apptsWhere }, { appts }) => appts.find(removeEmpty(apptsWhere))
);
// ⬆️ should it be { apptsWhere } or apptsWhere?

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
  (_, { details }, { appts }) => (
    appts.insert({
      timeSlot: details.timeSlot,
      block: details.block,
      userEmail: details.userEmail,
      type: details.type,
      typeDetails: getTypeDetails(details)
    })
  )
);

const updateAppt = isOwnApptResolver.createResolver(
  (_, { id, details }, { appts, targetAppt }) => {
    const newTypeDetails = getTypeDetails(details);
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
    user: (appt, args, { users }) => users.by('email', appt.userEmail), // not sure this works at this point
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
