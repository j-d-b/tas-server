const bcrypt = require('bcrypt');

const { isAuthenticatedResolver } = require('../auth');
const { isAllowedPasswordCheck, isCorrectPasswordCheck } = require('../checks');

// changePass(newPassword: String!, currPassword: String!): String
const changePass = isAuthenticatedResolver.createResolver(
  async (obj, { currPassword, newPassword }, { users, user }) => {
    const userInDb = users.by('email', user.userEmail);
    await isCorrectPasswordCheck(currPassword, userInDb);
    
    isAllowedPasswordCheck(newPassword);

    return bcrypt.hash(newPassword, 10).then((hash) => {
      userInDb.password = hash;
      users.update(userInDb);
      return 'Password updated successfully';
    });
  }
);

module.exports = changePass;
