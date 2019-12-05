const { isAuthenticatedResolver } = require('../auth');

// me: User
const me = isAuthenticatedResolver.createResolver(
  async (_, args, { user, User }) => User.findByPk(user.userEmail)
);

module.exports = me;
