const { combineResolvers } = require('apollo-resolvers');

const { DBTypeError } = require('../errors');

const UserResolvers = require('./user');
const ApptResolvers = require('./appointment');

// query
const me = require('./query/me');
const user = require('./query/user');
const users = require('./query/users');
const myAppts = require('./query/my-appts');
const appt = require('./query/appt');
const appts = require('./query/appts');

// mutation
const login = require('./mutation/login');
const resetPassword = require('./mutation/reset-password');
const sendResetPassLink = require('./mutation/send-reset-pass-link');
const changeEmail = require('./mutation/change-email');
const changePassword = require('./mutation/change-password');

const res = {
  Query: {
    me,
    user,
    users,
    myAppts,
    appt,
    appts
  },
  Mutation: {
    login,
    resetPassword,
    sendResetPassLink,
    changeEmail,
    changePassword
  },
  User: {
    appts: (user, args, { appts }) => appts.find({ userEmail: user.email })
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
}

const Resolvers = combineResolvers([
  UserResolvers,
  ApptResolvers,
  res
]);

module.exports = Resolvers;
