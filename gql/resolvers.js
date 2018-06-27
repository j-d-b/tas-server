const { combineResolvers } = require('apollo-resolvers');

const UserResolvers = require('./resolvers/user');
const ApptResolvers = require('./resolvers/appointment');

const login = require('./resolvers/login');
const resetPassword = require('./resolvers/reset-password');
const sendResetPassLink = require('./resolvers/send-reset-pass-link');
const changeEmail = require('./resolvers/change-email');
const changePassword = require('./resolvers/change-password');

const actionResolvers = {
  Mutation: {
    login,
    resetPassword,
    sendResetPassLink,
    changeEmail,
    changePassword
  }
}

const Resolvers = combineResolvers([
  UserResolvers,
  ApptResolvers,
  actionResolvers
]);

module.exports = Resolvers;
