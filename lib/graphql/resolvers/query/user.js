const { isAdminResolver } = require('../auth');

// user(email: UserInput!): User
const user = isAdminResolver.createResolver(
  async (_, { input: { email } }, { User }) => User.findByPk(email)
);

module.exports = user;
