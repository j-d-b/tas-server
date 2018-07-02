const bcrypt = require('bcrypt');
const { createResolver } = require('apollo-resolvers');

const { isAuthenticatedResolver } = require('../auth');
const { isAllowedPasswordCheck, isCorrectPasswordCheck } = require('../checks');
const { IncorrectPasswordError } = require('../errors');

// check auth
// check if newPassword is allowable
// check if user's password is correct
// change password
// return success string

// changePassword(newPassword: String!, currPassword: String!): String
const changePassword = isAuthenticatedResolver.createResolver(
  async (obj, { currPassword, newPassword }, { users, user }) => {
    isAllowedPasswordCheck(newPassword);

    const userInDb = users.by('email', user.userEmail);
    await isCorrectPasswordCheck(currPassword, userInDb);

    return bcrypt.hash(newPassword, 10).then(hash => {
      userInDb.password = hash;
      users.update(userInDb);
      return 'Password updated successfully';
    });
  }
);

module.exports = changePassword;
