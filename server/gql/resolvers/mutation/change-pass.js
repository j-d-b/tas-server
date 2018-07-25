const bcrypt = require('bcrypt');

const { isAuthenticatedResolver } = require('../auth');
const { isAllowedPasswordCheck, isCorrectPasswordCheck } = require('../checks');

// changePass(newPassword: String!, currPassword: String!): String
const changePass = isAuthenticatedResolver.createResolver(
  async (obj, { currPassword, newPassword }, { user, User }) => {
    const userInDb = await User.findById(user.userEmail);
    await isCorrectPasswordCheck(currPassword, userInDb);

    isAllowedPasswordCheck(newPassword);

    const hash = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hash }, { where: { email: user.userEmail }});

    return 'Password updated successfully';
  }
);

module.exports = changePass;
