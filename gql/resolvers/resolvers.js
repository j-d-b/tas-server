// queries
const me = require('./query/me');
const user = require('./query/user');
const users = require('./query/users');
const myAppts = require('./query/my-appts');
const appt = require('./query/appt');
const appts = require('./query/appts');
const allBlocks = require('./query/all-blocks');
const block = require('./query/block');

// mutations
const login = require('./mutation/login');
const resetPassword = require('./mutation/reset-password');
const sendResetPassLink = require('./mutation/send-reset-pass-link');
const verifyEmail = require('./mutation/verify-email');
const changeEmail = require('./mutation/change-email');
const changePassword = require('./mutation/change-password');
const addUser = require('./mutation/add-user');
const updateUser = require('./mutation/update-user');
const deleteUser = require('./mutation/delete-user');
const confirmUser = require('./mutation/confirm-user');
const addAppt = require('./mutation/add-appt');
const updateAppt = require('./mutation/update-appt');
const deleteAppt = require('./mutation/delete-appt');
const updateBlockMaxAllowed = require('./mutation/update-block-max-allowed');
const updateBlockCurrAllowed = require('./mutation/update-block-curr-allowed');

const Resolvers = {
  Query: {
    me,
    user,
    users,
    myAppts,
    appt,
    appts,
    allBlocks,
    block
  },
  Mutation: {
    login,
    resetPassword,
    sendResetPassLink,
    verifyEmail,
    changeEmail,
    changePassword,
    addUser,
    updateUser,
    deleteUser,
    confirmUser,
    addAppt,
    updateAppt,
    deleteAppt,
    updateBlockMaxAllowed,
    updateBlockCurrAllowed
  },
  User: {
    appts: (user, args, { appts }) => appts.find({ userEmail: user.email })
  },
  Appt: { //
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
