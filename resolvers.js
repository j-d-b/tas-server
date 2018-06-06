const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { saveDb, addAppt, updateAppt, changePass } = require('./db-utils');
const { removeEmpty, TwentyFourHrFromNow } = require('./utils');
const { isAuthorized, checkPass } = require('./auth');

// appts collection in database given as context
const resolvers = {
  Query: {
    appts: (obj, args, { appts, users, user }) => {
      isAuthenticated(user);
      isAuthorized(users, user, 'customer');
      return appts.find(removeEmpty(args));
    },
    appt: (obj, { id }, { appts, users, user }) => {
      isAuthenticated(user);
      isAuthorized(users, user, 'customer');
      return appts.by('id', id);
    },
    me: (obj, args, { users, user }) => {
      isAuthenticated(user);
      isAuthorized(users, user, 'customer');
      return users.by('email', user.email);
    },
    users: (obj, args, { users, user }) => {
      isAuthenticated(user);
      isAuthorized(users, user, 'admin');
      return users.find();
    }
  },
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
    addUser: async (obj, { email, password, userDetails }, { db, users }) => { // TODO add userDetails
      checkPass(password);

      let newUser = users.by('email', email);
      if (newUser) throw new Error(`User ${email} already exists`);

      const encryptedPass = await bcrypt.hash(password, 10);
      newUser = users.insert({ email, role: 'customer', password: encryptedPass });
      saveDb(db);

      return jwt.sign({ exp: TwentyFourHrFromNow(), email: user.email }, process.env.JWT_SECRET);
    },
    changePassword: async (obj, { email, currPassword, newPassword }, { db, users, user }) => {
      checkPass(newPassword);

      const targetUser = users.by('email', email);
      if (!targetUser) {
        throw new Error(`No user ${email}`);
      }

      let isAdmin = false;
      if (user) { // if already authenicated
        email === user.email ? isAuthorized(users, user, 'customer') : isAuthorized(users, user, 'admin');
        isAdmin = user.role === 'admin'; // TODO check this can't be hacked
      }

      // if admin, can change the password without knowing currPassword
      const valid = isAdmin || await bcrypt.compare(currPassword, targetUser.password);
      if (!valid) throw new Error('Incorrect password');

      return bcrypt.hash(newPassword, 10).then(hash => {
        changePass(db, users, targetUser, hash);
        return 'Password updated successfully';
      });
    },
    login: async (obj, { email, password }, { users }) => {
      const user = users.by('email', email);
      if (!user) throw new Error(`No user ${email}`);

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Incorrect password');

      const expDate = TwentyFourHrFromNow();
      return jwt.sign({ exp: expDate, email: user.email }, process.env.JWT_SECRET);
    }
  }
};

module.exports = resolvers;
