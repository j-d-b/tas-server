const bcrypt = require('bcrypt');

const { notLoggedInResolver } = require('../auth');
const { isAllowedPasswordCheck, resetTokenCheck } = require('../checks');

// resetPassword(resetToken: String!, newPassword: String!): String
const resetPassword = notLoggedInResolver.createResolver(
  async (_, { resetToken, newPassword }, { users }) => {
    isAllowedPasswordCheck(newPassword);

    const targetUser = resetTokenCheck(resetToken, users);
    targetUser.password = await bcrypt.hash(newPassword, 10);

    return 'Password updated successfully';
  }
);

module.exports = resetPassword;
