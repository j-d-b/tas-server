const { isAuthenticatedResolver } = require('../auth');

// logout(input: LogoutInput!): String
const logout = isAuthenticatedResolver.createResolver(
  async (_, args, { user, User, res }) => {
    const targetUser = await User.findByPk(user.userEmail);
    await targetUser.update({ refreshToken: null });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      maxAge: (60 * 60 * 24 * 30) // 30 days
    });

    return 'User successfully logged out';
  }
);

module.exports = logout;
