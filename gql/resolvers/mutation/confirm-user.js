const { createResolver, and } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');
const { doesUserExistCheck, isUserNotConfirmedCheck } = require('../checks');
const { sendAcctConfirmedLink } = require('../../../sendmail');

// confirmUser(email: String!): User
const confirmUser = isAdminResolver.createResolver(
  (_, { email }, { users, user }) => {
    const targetUser = doesUserExistCheck(email, users);
    isUserNotConfirmedCheck(targetUser);

    targetUser.confirmed = true;
    users.update(targetUser);

    sendAcctConfirmedLink(email, 'https://localhost:3000/login'); // TODO prod + email verification // note no verification that the email actually sent

    return targetUser;
  }
);

module.exports = confirmUser;
