const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createResolver, and } = require('apollo-resolvers');

const { isAllowedPasswordResolver, notLoggedInResolver } = require('../auth');
const { InvalidOrExpiredLinkError } = require('../errors');

// check if newPassword is allowable
// check if not logged in
// check given reset token for validity (using user's current password as secret key)
// change current password to newPassword
// return success string

// resetPassword(resetToken: String!, newPassword: String!): String
const resetPassword = and(isAllowedPasswordResolver, notLoggedInResolver)(
  async (_, { resetToken, newPassword }, { users }) => {
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
