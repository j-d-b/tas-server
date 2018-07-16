const bcrypt = require('bcrypt');

const { notLoggedInResolver } = require('../auth');
const { isAllowedPasswordCheck, resetTokenCheck } = require('../checks');

// resetPass(resetToken: String!, newPassword: String!): String
const resetPass = notLoggedInResolver.createResolver(
  async (_, { resetToken, newPassword }, { users }) => {
    const targetUser = resetTokenCheck(resetToken, users);
    targetUser.password = await bcrypt.hash(newPassword, 10);

    isAllowedPasswordCheck(newPassword);

    return 'Password updated successfully';
  }
);

module.exports = resetPass;
