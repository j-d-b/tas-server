const { isAdminResolver } = require('../auth');

// user(email: UserInput!): User
const user = isAdminResolver.createResolver(
  async (_, { input: { email } }, { User }) => {
    if (email === 'root') return null;
    return User.findByPk(email);
  }
);

module.exports = user;
