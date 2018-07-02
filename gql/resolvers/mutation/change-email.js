const { createResolver } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');
const { NoUserInDBError, UserAlreadyInDBError } = require('../errors');

// check auth
// is user admin
// check if target user (by currEmail) exists
// ensure newEmail does not match the email of another user already in the db
// change email
// return success string detailing change

// changeEmail(currEmail: String!, newEmail: String!): String
const changeEmail = isAdminResolver.createResolver(
  (_, { currEmail, newEmail }, { users }) => {
    const targetUser = users.by('email', currEmail);
    if (!targetUser) throw new NoUserInDBError({ data: { targetUser: currEmail }});
    if (users.by('email', newEmail)) throw new UserAlreadyInDBError({ data: { targetUser: newEmail }});

    targetUser.email = newEmail;
    users.update(targetUser);

    // IDEA send email to old user email and new one

    return `User ${currEmail} changed to ${newEmail}`;
  }
);

module.exports = changeEmail;