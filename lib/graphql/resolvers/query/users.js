const { isAdminResolver } = require('../auth');

// users(input: UsersInput!): [User]
const users = isAdminResolver.createResolver(
  async (_, { input: { where } }, { User }) => User.findAll({ where })
);

module.exports = users;
