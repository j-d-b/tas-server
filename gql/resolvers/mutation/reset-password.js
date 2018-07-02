const bcrypt = require('bcrypt');
const { createResolver } = require('apollo-resolvers');

const { notLoggedInResolver } = require('../auth');
const { isAllowedPasswordCheck, resetTokenCheck } = require('../checks');

// check if not logged in
// check if newPassword is allowable
// check given reset token for validity
// change current password to newPassword
// return success string

// resetPassword(resetToken: String!, newPassword: String!): String
const resetPassword = notLoggedInResolver.createResolver(
  async (_, { resetToken, newPassword }, { users }) => {
    const targetUser = resetTokenCheck(resetToken, users);
    targetUser.password = await bcrypt.hash(newPassword, 10);
    return 'Password updated successfully';
  }
);

module.exports = resetPassword;
