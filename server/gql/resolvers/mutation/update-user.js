const { isAuthenticatedResolver } = require('../auth');
const { isAdmin } = require('../helpers');
const { doesUserExistCheck, isUserSelfCheck, isRoleOwnRoleCheck } = require('../checks');

// updateUser(email: String!, details: UpdateUserInput!): User
const updateUser = isAuthenticatedResolver.createResolver(
  async (_, { email, details }, { user, User }) => {
    const targetUser = await doesUserExistCheck(email, User);

    if (!isAdmin(user)) {
      isUserSelfCheck(email, user);
      isRoleOwnRoleCheck(details.role, user);
    }

    await User.update(details, { where: { email }});

    return User.findById(email);
  }
);

module.exports = updateUser;
