const { isAdminResolver } = require('../auth');
const { removeEmpty } = require('../helpers');

// users(where: UsersWhere): [User]
const users = isAdminResolver.createResolver(
  (_, { where }, { users }) => users.find(removeEmpty(where))
);

module.exports = users;
