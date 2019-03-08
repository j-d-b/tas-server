const bcrypt = require('bcrypt');

const { notLoggedInResolver } = require('../auth');
const { verifyTokenCheck } = require('../checks');
const { signJwt, generateRefreshToken } = require('../helpers');

// verifyEmail(input: VerifyEmailInput!): String
const verifyEmail = notLoggedInResolver.createResolver(
  async (_, { input: { verifyToken } }, { res, User }) => {
    const targetUser = await verifyTokenCheck(verifyToken, User);

    await targetUser.update({ emailVerified: true });

    const refreshToken = generateRefreshToken();
    await targetUser.update({ refreshToken: await bcrypt.hash(refreshToken, 10) });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: (60 * 60 * 24 * 30) // 30 days
    });

    return signJwt(targetUser);
  }
);

module.exports = verifyEmail;
