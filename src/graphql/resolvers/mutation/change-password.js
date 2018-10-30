const bcrypt = require('bcrypt');

const { isAuthenticatedResolver } = require('../auth');
const { isAllowedPasswordCheck, isCorrectPasswordCheck } = require('../checks');

// changePassword(input: ChangePasswordInput!): String
const changePassword = isAuthenticatedResolver.createResolver(
  async (obj, { input: { newPassword, currPassword } }, { user, User }) => {
    const targetUser = await User.findById(user.userEmail);
    await isCorrectPasswordCheck(currPassword, targetUser);

    isAllowedPasswordCheck(newPassword);

    const hash = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hash }, { where: { email: user.userEmail } });

    return 'Password updated successfully';
  }
);

module.exports = changePassword;
