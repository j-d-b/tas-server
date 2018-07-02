const { createResolver } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');

// check auth
// is user admin
// check if target user (by currEmail) exists
// ensure newEmail does not match the email of another user already in the db
// change email
// return success string detailing change

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
