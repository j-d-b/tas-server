const { isAdminResolver } = require('../auth');
const { doesUserExistCheck, isUserNotSelfCheck } = require('../checks');

// deleteUser(email: String!): String
const deleteUser = isAdminResolver.createResolver(
  async (_, { email }, { user, User, Appt }) => {
    const targetUser = await doesUserExistCheck(email, User);
    isUserNotSelfCheck(targetUser.email, user);
    
    return User.destroy({ where: { email }, limit: 1 }).then(() => `User ${email} deleted successfully`);
  }
);

module.exports = deleteUser;
