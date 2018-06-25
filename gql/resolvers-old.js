const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { saveDb, addAppt, updateAppt, changePass } = require('./db-utils');
const { removeEmpty, twelveHrFromNow } = require('./utils');
const { isAuthenticated, isAuthorized, checkPass } = require('./auth');

const resolvers = {
  Mutation: {
    addAppt: (obj, { apptDetails }, { db, appts, users, user }) => { // IDEA disable adding duplicate appts?
      isAuthenticated(user);

      // only operators/admins can add appts for other users
      apptDetails.user === user.email ? isAuthorized(users, user, 'customer') : isAuthorized(users, user, 'operator');

      return addAppt(db, appts, apptDetails);
    },
    updateAppt: (obj, { id, apptDetails }, { db, appts, users, user }) => {
      isAuthenticated(user);
      const targetAppt = appts.by('id', id);

      // only operators/admins can update appts for other users
      apptDetails.user === user.email ? isAuthorized(users, user, 'customer') : isAuthorized(users, user, 'operator');

      return updateAppt(db, appts, targetAppt, apptDetails);
    },
    delAppt: (obj, { id }, { db, appts, user }) => {
      isAuthenticated(user);
      const targetAppt = appts.by('id', id);

      // require operator permissions to delete other users appts
      targetAppt.user === user.email ? isAuthorized(users, user, 'customer') : isAuthorized(users, user, 'operator');

      return delAppt(db, appts, targetAppt);
    },
    addUser: async (obj, { email, password, userDetails }, { db, users, user }) => {
      checkPass(password); // form validation

      if (users.by('email', email)) throw new Error(`User with email ${email} already exists`);

      if (userDetails.role) { // only admin can add user with a non-customer role
        if (userDetails.role !== 'customer') isAuthorized(users, user, 'admin');
      } else {
        userDetails.role = 'customer';
      }

      const encryptedPass = await bcrypt.hash(password, 10);
      users.insert({
        email,
        password: encryptedPass,
        ...userDetails
      });
      saveDb(db);

      return jwt.sign({ exp: twelveHrFromNow(), email: email, role: userDetails.role }, process.env.JWT_SECRET);
    },
    changePassword: async (obj, { email, newPassword, currPassword }, { db, users, user }) => {
      checkPass(newPassword); // form validation

      const targetUser = users.by('email', email);
      if (!targetUser) throw new Error(`No user ${email}`);

      let isAdmin = false;
      if (user) { // if already authenicated
        if (email !== user.email) isAuthorized(users, user, 'admin');
        isAdmin = users.by('email', user.email).role === 'admin'; // TODO check this can't be hacked
      }

      // if admin, can change the password without knowing currPassword
      const valid = isAdmin || await bcrypt.compare(currPassword, targetUser.password);
      if (!valid) throw new Error('Incorrect password');

      return bcrypt.hash(newPassword, 10).then(hash => {
        changePass(db, users, targetUser, hash);
        return 'Password updated successfully';
      });
    },
    resetPassword: async (obj, { newPassword, token }, { db, users }) => {
      checkPass(newPassword); // form validation

      const email = jwt.decode(token).email;
      const targetUser = users.by('email', email);
      jwt.verify(token, targetUser.password); // curr password hash is secret key

      const hash = await bcrypt.hash(newPassword, 10);
      changePass(db, users, targetUser, hash);

      return 'Password updated successfully';
    },
    sendResetPassLink: (obj, { email }, { db, users }) => {
      const targetUser = users.by('email', email);
      if (!targetUser) throw new Error(`No user ${email}`);

      const resetToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hr
        email: targetUser.email
      }, targetUser.password); // use password hash as secret; single use JWT

      const resetLink = `http://localhost:3000/new-password/${resetToken}`;

      console.log(resetLink);
      return resetLink;
      // send link
    },
    login: async (obj, { email, password }, { users }) => {
      const user = users.by('email', email);
      if (!user) throw new Error(`No user ${email}`);

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Incorrect password');

      return jwt.sign({ exp: twelveHrFromNow(), email: user.email, role: user.role }, process.env.JWT_SECRET);
    }
  }
};

module.exports = resolvers;
