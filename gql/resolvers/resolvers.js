// queries
const me = require('./query/me');
const user = require('./query/user');
const users = require('./query/users');
const myAppts = require('./query/my-appts');
const appt = require('./query/appt');
const appts = require('./query/appts');

// mutations
const login = require('./mutation/login');
const resetPassword = require('./mutation/reset-password');
const sendResetPassLink = require('./mutation/send-reset-pass-link');
const changeEmail = require('./mutation/change-email');
const changePassword = require('./mutation/change-password');
const addUser = require('./mutation/add-user');
const updateUser = require('./mutation/update-user');
const deleteUser = require('./mutation/delete-user');
const addAppt = require('./mutation/add-appt');
const updateAppt = require('./mutation/update-appt');
const deleteAppt = require('./mutation/delete-appt');

const Resolvers = {
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
    changePassword,
    addUser,
    updateUser,
    deleteUser,
    addAppt,
    updateAppt,
    deleteAppt
  },
  User: {
    appts: (user, args, { appts }) => appts.find({ userEmail: user.email })
  },
  Appointment: { //
    id: appt => appt.$loki, // uses $loki for id <- TODO assess this choice
    user: (appt, args, { users }) => users.by('email', appt.userEmail)
  },
  TypeDetails: {
    __resolveType(obj) {
      if (obj.formNumber705) return 'ImportFull';
      if (obj.emptyForCityFormNum) return 'ImportEmpty';
      if (obj.bookingNum) return 'ExportFull';
      if (obj.containerID && obj.containerSize && Object.keys(obj).length === 2) return 'ExportEmpty';
      return null;
    }
  }
}

module.exports = Resolvers;
