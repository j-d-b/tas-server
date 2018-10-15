const { isAdminResolver } = require('../auth');
const { doesUserExistCheck, userDoesntExistCheck } = require('../checks');

// changeUserEmail(input: ChangeUserEmailInput!): String
const changeUserEmail = isAdminResolver.createResolver(
  async (_, { input: { currEmail, newEmail } }, { User }) => {
    await doesUserExistCheck(currEmail, User);
    await userDoesntExistCheck(newEmail, User);

    await User.update({ email: newEmail }, { where: { email: currEmail } });

    // IDEA: send email to old and new user email

    return `User ${currEmail} changed to ${newEmail}`;
  }
);

module.exports = changeUserEmail;
