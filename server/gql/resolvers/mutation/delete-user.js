const { isAdminResolver } = require('../auth');
const { doesUserExistCheck, isUserNotSelfCheck } = require('../checks');

// deleteUser(email: String!): String
const deleteUser = isAdminResolver.createResolver(
  (_, { email }, { users, user }) => {
    const targetUser = doesUserExistCheck(email, users);
    isUserNotSelfCheck(targetUser.email, user);

    users.remove(targetUser);
    return `User ${email} deleted successfully`;
  }
);

module.exports = deleteUser;
