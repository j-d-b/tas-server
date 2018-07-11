const { isAdminResolver } = require('../auth');

// user(email: String!): User
const user = isAdminResolver.createResolver(
  (_, args, { users }) => users.by('email', args.email)
);

module.exports = user;
