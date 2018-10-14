const { isAuthenticatedResolver } = require('../auth');

// me: User
const me = isAuthenticatedResolver.createResolver(
  async (_, args, { user, User }) => User.findById(user.userEmail)
);

module.exports = me;
