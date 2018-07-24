const { notLoggedInResolver } = require('../auth');
const { doesUserExistCheck, isUserConfirmedCheck, isUserEmailVerifiedCheck, isCorrectPasswordCheck } = require('../checks');
const { signJwt } = require('../helpers');

// login(email: String!, password: String!): String
const login = notLoggedInResolver.createResolver(
  async (_, { email, password }, { User }) => {
    const targetUser = await doesUserExistCheck(email, User);
    isUserConfirmedCheck(targetUser);
    isUserEmailVerifiedCheck(targetUser);
    return isCorrectPasswordCheck(password, targetUser).then(() => signJwt(targetUser));
  }
);

module.exports = login;
