const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createResolver } = require('apollo-resolvers');
const { createError } = require('apollo-errors');

const {
  baseResolver,
  notLoggedInResolver,
  isAuthenticatedResolver,
  isAdminResolver,
  isOwnApptResolver
} = require('./auth');
const { twelveHrFromNow } = require('../../utils');
const { DBTypeError } = require('../errors');

// THIS IS IN users.js as well! Modularize!
const checkPass = (password) => { //
  if (password.length < 6) throw new Error('Password must be at least 6 characters'); // TODO
};

// login(email: String!, password: String!): String
const login = notLoggedInResolver.createResolver(
  async (_, { email, password }, { users }) => {
    const user = users.by('email', email);
    if (!user) throw new Error(`No user ${email}`);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Incorrect password');

    return jwt.sign({
      exp: twelveHrFromNow(),
      email: user.userEmail,
      role: user.userRole
    }, process.env.JWT_SECRET);
  }
);

// changePassword(newPassword: String!, currPassword: String!): String
const changePassword = isAuthenticatedResolver.createResolver(
  async (obj, { currPassword, newPassword }, { users, user }) => {
    checkPass(newPassword); // form validation

    const valid = await bcrypt.compare(currPassword, targetUser.password);
    if (!valid) throw new Error('Incorrect password');

    return bcrypt.hash(newPassword, 10).then(hash => {
      const userInDb = users.by('email', user.userEmail);
      userInDb.password = hash;
      users.update(userInDb);
      return 'Password updated successfully';
    });
  }
);

// resetPassword(token: String!, newPassword: String!): String
const resetPassword = notLoggedInResolver.createResolver(
  async (_, { token, newPassword }, { users }) => {
    checkPass(newPassword); // form validation

    const targetUser = users.by('email', jwt.decode(token).userEmail);
    try {
      jwt.verify(token, targetUser.password); // current password hash is secret key
    } catch (err) {
      throw new Error('Password reset link invalid or expired');
    }

    const hash = await bcrypt.hash(newPassword, 10);
    changePass(db, users, targetUser, hash);

    return 'Password updated successfully';
  }
);

// sendResetPassLink(email: String!): String
const sendResetPassLink = notLoggedInResolver.createResolver(
  (_, { email }, { users }) => {
    const targetUser = users.by('email', email);
    if (!targetUser) throw new Error(`No user ${email}`);

    const resetToken = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // one hour
      userEmail: targetUser.email
    }, targetUser.password); // use current password hash as secret; single use JWT

    const resetLink = `http://localhost:3000/new-password/${resetToken}`; // TODO for production

    console.log(resetLink);
    // TODO send link
    return resetLink;
  }
);

// changeEmail(currEmail: String!, newEmail: String!): String
const changeEmail = isAdminResolver.createResolver(
  (_, { currEmail, newEmail }, { users }) => {
    const targetUser = users.by('email', currEmail);
    if (!targetUser) throw new Error(`User ${email} does not exist`); // TODO apollo-errors

    targetUser.email = newEmail;
    users.update(targetUser);
    // IDEA send email to old user email and new one

    return `User ${currEmail} changed to ${newEmail}`;
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
