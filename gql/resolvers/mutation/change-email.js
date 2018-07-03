const { createResolver } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');

// changeEmail(currEmail: String!, newEmail: String!): String
const changeEmail = isAdminResolver.createResolver(
  (_, { currEmail, newEmail }, { users }) => {
    const targetUser = doesUserExistCheck(currEmail, users);
    doesUserNotExistCheck(newEmail, users);

    targetUser.email = newEmail;
    users.update(targetUser);

    // IDEA send email to old user email and new one

    return `User ${currEmail} changed to ${newEmail}`;
  }
);

module.exports = changeEmail;
