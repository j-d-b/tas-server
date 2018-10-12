const { isAdminResolver } = require('../auth');
const { doesUserExistCheck, doesUserNotExistCheck } = require('../checks');

// changeEmail(input: ChangeEmailInput!): String
const changeEmail = isAdminResolver.createResolver(
  async (_, { input: { currEmail, newEmail } }, { User }) => {
    await doesUserExistCheck(currEmail, User); // IDEA chain these for single db connection
    await doesUserNotExistCheck(newEmail, User);

    await User.update({ email: newEmail }, { where: { email: currEmail } });

    // IDEA send email to old user email and new one

    return `User ${currEmail} changed to ${newEmail}`;
  }
);

module.exports = changeEmail;
