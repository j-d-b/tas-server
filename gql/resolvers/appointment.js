const { createResolver } = require('apollo-resolvers');
const { createError } = require('apollo-errors');

const { isAuthenticatedResolver, hasOperatorPermissionsResolver, isAdminResolver } = require('./auth');
const { removeEmpty } = require('/utils');
const { DBTypeError } = require('../errors');

// queries
const myAppts = isAuthenticatedResolver.createResolver(
  (_, args, { users, user }) => appts.find({ userEmail: user.email });
);

const appt = isAuthenticatedResolver.createResolver(
  (_, { id }, { appts }) => appts.get(id);
);

const appts = isAuthenticatedResolver.createResolver(
  (_, apptsWhere, { appts }) => appts.find(removeEmpty(apptsWhere));
);


// mutations
addAppt(details: ApptInput!): Appointment
updateAppt(id: ID!, details: ApptInput!): Appointment
deleteAppt(id: ID!): String

module.exports = {
  Query: {
    myAppts,
    appt,
    appts
  },
  Mutation: {

  },
  Appt: { //
    id: appt => appt.$loki; // uses $loki for id <- TODO assess this
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
