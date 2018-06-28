const bcrypt = require('bcrypt');
const { createResolver } = require('apollo-resolvers');

const { checkPass } = require('../helpers');
const { isAuthenticatedResolver } = require('../auth');
const { IncorrectPasswordError } = require('../errors');

// changePassword(newPassword: String!, currPassword: String!): String
const changePassword = isAuthenticatedResolver.createResolver(
  async (obj, { currPassword, newPassword }, { users, user }) => {
    checkPass(newPassword); // form validation

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
