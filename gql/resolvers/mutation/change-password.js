const bcrypt = require('bcrypt');
const { createResolver, and } = require('apollo-resolvers');

const { isAllowedPasswordResolver, isAuthenticatedResolver } = require('../auth');
const { IncorrectPasswordError } = require('../errors');

// changePassword(newPassword: String!, currPassword: String!): String
const changePassword = and(isAllowedPasswordResolver, isAuthenticatedResolver)(
  async (obj, { currPassword, newPassword }, { users, user }) => {
    const userInDb = users.by('email', user.userEmail);
    const valid = await bcrypt.compare(currPassword, userInDb.password);
    if (!valid) throw new IncorrectPasswordError();

    return bcrypt.hash(newPassword, 10).then(hash => {
      userInDb.password = hash;
      users.update(userInDb);
      return 'Password updated successfully';
    });
  }
);

module.exports = changePassword;
