const { isAuthenticatedResolver } = require('../auth');
const { doesUserExistCheck, isUserSelfCheck, isRoleOwnRoleCheck } = require('../checks');
const { isAdmin } = require('../helpers');

// updateUser(input: UpdateUserInput!): User
const updateUser = isAuthenticatedResolver.createResolver(
  async (_, { input: { email, ...details } }, { user, User }) => {
    await doesUserExistCheck(email, User);

    if (!isAdmin(user)) {
      isUserSelfCheck(email, user);
      isRoleOwnRoleCheck(details.role, user);
    }

    await User.update(details, { where: { email }});

    return User.findById(email);
  }
);

module.exports = updateUser;
