const { isAdminResolver } = require('../auth');

// user(email: UserInput!): User
const user = isAdminResolver.createResolver(
  async (_, { input: { email }}, { User }) => User.findById(email)
);

module.exports = user;
