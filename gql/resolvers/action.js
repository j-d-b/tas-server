const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');

const { twelveHrFromNow } = require('../../utils');
const {
  notLoggedInResolver,
  isAuthenticatedResolver,
  isAdminResolver,
  isOwnApptResolver
} = require('./auth');
const {
  DBTypeError,
  NoUserInDBError,
  IncorrectPasswordError,
  InvalidOrExpiredLinkError,
  UserAlreadyInDBError
} = require('../errors');

// THIS IS IN users.js as well! Modularize!
const checkPass = (password) => { //
  if (password.length < 6) throw new Error('Password must be at least 6 characters'); // TODO
};

// login(email: String!, password: String!): String
const login = notLoggedInResolver.createResolver(
  async (_, { email, password }, { users }) => {
    const user = users.by('email', email);
    if (!user) throw new NoUserInDBError({ data: { targetUser: email }});

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new IncorrectPasswordError();

    return jwt.sign({
      exp: twelveHrFromNow(),
      userEmail: user.email,
      userRole: user.role
    }, process.env.JWT_SECRET);
  }
);

// changePassword(newPassword: String!, currPassword: String!): String
const changePassword = isAuthenticatedResolver.createResolver(
  async (obj, { currPassword, newPassword }, { users, user }) => {
    checkPass(newPassword); // form validation

    const userInDb = users.by('email', user.userEmail);
    const valid = await bcrypt.compare(currPassword, userInDb.password);
    if (!valid) throw new IncorrectPasswordError();

    return bcrypt.hash(newPassword, 10).then(hash => {
      userInDb.password = hash;
      users.update(userInDb);
      return 'Password updated successfully';
    });
  }
);

// changeEmail(currEmail: String!, newEmail: String!): String
const changeEmail = isAdminResolver.createResolver(
  (_, { currEmail, newEmail }, { users }) => {
    const targetUser = users.by('email', currEmail);
    if (!targetUser) throw new NoUserInDBError({ data: { targetUser: currEmail }});
    if (users.by('email', newEmail)) throw new UserAlreadyInDBError({ data: { targetUser: newEmail }});

    targetUser.email = newEmail;
    users.update(targetUser);

    // IDEA send email to old user email and new one

    return `User ${currEmail} changed to ${newEmail}`;
  }
);

// sendResetPassLink(email: String!): String
const sendResetPassLink = notLoggedInResolver.createResolver(
  (_, { email }, { users }) => {
    const targetUser = users.by('email', email);
    if (!targetUser) throw new NoUserInDBError({ data: { targetUser: email }});

    const resetToken = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
      userEmail: targetUser.email
    }, targetUser.password); // use current password hash as secret; single use JWT

    const resetLink = `http://localhost:3000/new-password/${resetToken}`; // TODO for production

    console.log(resetLink);
    // TODO send link, send success string if successful send
    return resetLink;
  }
);

// resetPassword(token: String!, newPassword: String!): String
const resetPassword = notLoggedInResolver.createResolver(
  async (_, { token, newPassword }, { users }) => {
    checkPass(newPassword); // form validation

    let targetUser;
    try {
      targetUser = users.by('email', jwt.decode(token).userEmail);
      jwt.verify(token, targetUser.password); // current password hash is secret key
    } catch (err) {
      throw new InvalidOrExpiredLinkError();
    }

    targetUser.password = await bcrypt.hash(newPassword, 10);

    return 'Password updated successfully';
  }
);

module.exports = {
  Mutation: {
    login,
    changePassword,
    resetPassword,
    sendResetPassLink,
    changeEmail
  }
};
