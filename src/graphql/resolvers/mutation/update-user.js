const { isAuthenticatedResolver } = require('../auth');
const { doesUserExistCheck, isUserSelfCheck, isRoleOwnRoleCheck } = require('../checks');
const { isAdmin } = require('../helpers');

// updateUser(input: UpdateUserInput!): User
const updateUser = isAuthenticatedResolver.createResolver(
  async (_, { input: { email, ...details } }, { user, User }) => {
    const targetUser = await doesUserExistCheck(email, User);

    if (!isAdmin(user)) {
      isUserSelfCheck(email, user);
      isRoleOwnRoleCheck(details.role, user);
    }

    await targetUser.update(details);

    return targetUser;
  }
);

module.exports = updateUser;
