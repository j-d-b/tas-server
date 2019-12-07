const { isAdminResolver } = require('../auth');
const { doesUserExistCheck, isUserNotSelfCheck, isRootUserCheck } = require('../checks');

// deleteUser(input: DeleteUserInput!): String
const deleteUser = isAdminResolver.createResolver(
  async (_, { input: { email } }, { user, User }) => {
    isRootUserCheck(email);
    
    const targetUser = await doesUserExistCheck(email, User);
    isUserNotSelfCheck(targetUser.email, user); // can't delete yourself

    await targetUser.destroy();
    return `User ${email} deleted successfully`;
  }
);

module.exports = deleteUser;
