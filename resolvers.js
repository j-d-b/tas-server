const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { saveDb } = require('./db-utils');
const { removeEmpty } = require('./utils');


function checkAuth(user) {

}

// appts collection in database given as context
const resolvers = {
  Query: {
    appts: (root, args, { appts }) => appts.find(removeEmpty(args)),
    appt: (root, { id }, { appts }) => appts.by('id', id),
    me: (_, args, { users, user }) => {
      if (!user) {
        return { error: 'You are not authenticated' };
      }
      return users.by('email', user.email);
    }
  },
  Mutation: {
    addAppt: (root, args, { db, appts }) => {
      const newAppt = appts.insert(args);
      newAppt.id = newAppt.$loki; // use $loki as ID
      appts.update(newAppt);
      saveDb(db);
      return newAppt;
    },
    updateAppt: (root, { id, user, time, block, type }, { db, appts }) => { // update appt by id
      const targetAppt = appts.by('id', id);
      user && (targetAppt.user = user);
      time && (targetAppt.time = time);
      block && (targetAppt.block = block);
      type && (targetAppt.type = type);
      appts.update(targetAppt);
      saveDb(db);
      return targetAppt;
    },
    delAppt: (root, { id }, { db, appts }) => {
      appts.remove(appts.by('id', id));
      saveDb(db);
      return 'Appt deleted';
    },
    async signup(_, { email, password }, { db, users }) {
      let user;
      try {
        const pw = await bcrypt.hash(password, 10);
        console.log(pw);
        user = users.insert({ email, password: pw });
        saveDb(db);
      }
      catch(error) {
        console.log(`⚠️  Error adding: ${email}: ` + error);
        return error;
      }
      const expDate = Math.floor(Date.now() / 1000) + (60 * 60); // in 1hr
      return jwt.sign({ exp: expDate, email: user.email }, 'secret-boy');
    },
    async login(_, { email, password }, { users }) {
      const user = users.by('email', email);
      if (!user) {
        console.log(`😵  No user ${email}`);
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      console.log(valid);
      if (!valid) {
        console.log('🙅‍  Incorrect password');
        return null;
      }

      const expDate = Math.floor(Date.now() / 1000) + (60 * 60); // in 1hr
      return jwt.sign({ exp: expDate, email: user.email }, 'secret-boy');
    }
  }
};

module.exports = resolvers;
