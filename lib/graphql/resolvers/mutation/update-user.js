const { isAuthenticatedResolver } = require('../auth');
const { isRootUserCheck, doesUserExistCheck, isUserSelfCheck, isRoleOwnRoleCheck } = require('../checks');
const { isAdmin } = require('../helpers');

// updateUser(input: UpdateUserInput!): User
const updateUser = isAuthenticatedResolver.createResolver(
  async (_, { input: { email, ...details } }, { user, User }) => {
    isRootUserCheck(email);
    
    const targetUser = await doesUserExistCheck(email, User);

    if (!isAdmin(user)) {
      isUserSelfCheck(email, user);
      isRoleOwnRoleCheck(details.role, user);
    }

    return targetUser.update(details);
  }
);

module.exports = updateUser;
