const bcrypt = require('bcrypt');

const { notLoggedInResolver } = require('../auth');
const { isAllowedPasswordCheck, resetTokenCheck } = require('../checks');

// resetPassword(input: ResetPasswordInput!): String
const resetPassword = notLoggedInResolver.createResolver(
  async (_, { input: { resetToken, newPassword } }, { User }) => {
    const email = await resetTokenCheck(resetToken, User);
    isAllowedPasswordCheck(newPassword);

    const hash = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hash }, { where: { email } });

    return 'Password updated successfully';
  }
);

module.exports = resetPassword;
