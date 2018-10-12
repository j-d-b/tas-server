const { isAdminResolver } = require('../auth');
const { doesUserExistCheck, isUserNotSelfCheck } = require('../checks');

// deleteUser(input: DeleteUserInput!): String
const deleteUser = isAdminResolver.createResolver(
  async (_, { input: { email } }, { user, User }) => {
    const targetUser = await doesUserExistCheck(email, User);
    isUserNotSelfCheck(targetUser.email, user);

    await User.destroy({ where: { email }, limit: 1 });

    return `User ${email} deleted successfully`;
  }
);

module.exports = deleteUser;
