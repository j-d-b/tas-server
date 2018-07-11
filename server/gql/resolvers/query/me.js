const { isAuthenticatedResolver } = require('../auth');

// me: User
const me = isAuthenticatedResolver.createResolver(
  (_, args, { users, user }) => users.by('email', user.userEmail)
);

module.exports = me;
