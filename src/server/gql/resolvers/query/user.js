const { isAdminResolver } = require('../auth');

// user(email: String!): User
const user = isAdminResolver.createResolver(
  async (_, args, { User }) => User.findById(args.email)
);

module.exports = user;
