const bcrypt = require('bcrypt');

module.exports = {};

// this file is for actions, like sending password and such
// think about renaming

/*
login(email: String!, password: String!): String
changePassword(email: String, newPassword: String!, currPassword: String): String
resetPassword(token: String!, newPassword: String!): String
sendResetPassLink(email: String!): String
changeEmail(currEmail: String!, newEmail: String!): String


const changePass = (db, users, user, newPass) => {
  user.password = newPass;
  users.update(user);
  saveDb(db);
};

const resolvers = {
  Mutation: {
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
*/
