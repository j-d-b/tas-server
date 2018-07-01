const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createResolver, and } = require('apollo-resolvers');

const { isAllowedPasswordResolver, notLoggedInResolver } = require('../auth');
const { InvalidOrExpiredLinkError } = require('../errors');

// resetPassword(token: String!, newPassword: String!): String
const resetPassword = and(isAllowedPasswordResolver, notLoggedInResolver)(
  async (_, { token, newPassword }, { users }) => {
    let targetUser;
    try {
      targetUser = users.by('email', jwt.decode(token).userEmail);
      jwt.verify(token, targetUser.password); // current password hash is secret key
    } catch (err) {
      throw new InvalidOrExpiredLinkError();
    }

    targetUser.password = await bcrypt.hash(newPassword, 10);

    return 'Password updated successfully';
  }
);

module.exports = resetPassword;
