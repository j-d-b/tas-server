const { isAuthenticatedResolver } = require('../auth');

// me: User
const me = isAuthenticatedResolver.createResolver(
  async (_, args, { User, user }) => await User.findById(user.userEmail)
);

module.exports = me;
