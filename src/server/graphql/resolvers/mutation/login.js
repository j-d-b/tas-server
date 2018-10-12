const { notLoggedInResolver } = require('../auth');
const { doesUserExistCheck, isUserConfirmedCheck, isUserEmailVerifiedCheck, isCorrectPasswordCheck } = require('../checks');
const { signJwt } = require('../helpers');

// login(input: LoginInput!): String
const login = notLoggedInResolver.createResolver(
  async (_, { intpu: { email, password } }, { User }) => {
    const targetUser = await doesUserExistCheck(email, User);

    isUserConfirmedCheck(targetUser);
    isUserEmailVerifiedCheck(targetUser);
    await isCorrectPasswordCheck(password, targetUser);

    return signJwt(targetUser);
  }
);

module.exports = login;
