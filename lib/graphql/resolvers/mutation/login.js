const bcrypt = require('bcrypt');

const { notLoggedInResolver } = require('../auth');
const { doesUserExistCheck, isUserConfirmedCheck, isUserEmailVerifiedCheck, isCorrectPasswordCheck } = require('../checks');
const { generateRefreshToken, signJwt, FIFTEEN_DAYS_IN_MS } = require('../helpers');

// login(input: LoginInput!): String
const login = notLoggedInResolver.createResolver(
  async (_, { input: { email, password } }, { User, res }) => {
    const targetUser = await doesUserExistCheck(email, User);
    isUserConfirmedCheck(targetUser);
    isUserEmailVerifiedCheck(targetUser);
    await isCorrectPasswordCheck(password, targetUser);

    const refreshToken = generateRefreshToken();
    await targetUser.update({ refreshToken: await bcrypt.hash(refreshToken, 10) });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: FIFTEEN_DAYS_IN_MS
    });

    return signJwt(targetUser);
  }
);

module.exports = login;
