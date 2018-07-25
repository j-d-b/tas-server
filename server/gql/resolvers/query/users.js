const { isAdminResolver } = require('../auth');

// users(where: UsersWhere): [User]
const users = isAdminResolver.createResolver(
  async (_, { where }, { User }) => User.findAll({ where })
);

module.exports = users;
