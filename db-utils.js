const bcrypt = require('bcrypt');

// saves the database to memory
const saveDb = (db) => {
  db.saveDatabase(err => {
    if (err) {
      console.log('⚠️  Error saving database: ' + err);
    } else {
      console.log('👌  Database saved successfully');
    }
  });
};
module.exports.saveDb = saveDb;

// abstracted, robust insert, which also adds id
// returns new appointment
module.exports.addAppt = (db, appts, apptDetails) => {
  const newAppt = appts.insert(apptDetails);
  newAppt.id = newAppt.$loki; // use $loki as ID
  appts.update(newAppt);
  saveDb(db);
  return newAppt;
};

// updates the targetAppt with the new apptDetails
// returns updated appointment
module.exports.updateAppt = (db, appts, targetAppt, apptDetails) => {
  Object.entries(apptDetails).forEach(([field, val]) => targetAppt[field] = val);

  appts.update(targetAppt);
  saveDb(db);
  return targetAppt;
};

// removes the targetAppt
module.exports.delAppt = (db, appts, targetAppt) => {
  appts.remove(targetAppt);
  saveDb(db);
  return 'Appointment deleted';
};

module.exports.changePass = (db, users, user, newPass) => {
  user.password = newPass;
  users.update(user);
  saveDb(db);
};

// sets up the necessary collections for appointments and users in the given database
module.exports.initDb = (db) => {
  console.log('⚙️  Initializing database');
  console.log('Adding collections:');

  db.addCollection('appointments', { unique: ['id'] });
  console.log('appointments...');

  db.addCollection('users', { unique: ['email'] });
  console.log('users...');

  db.saveDatabase(err => {
    if (err) {
      throw new Error('⚠️  Error saving database: ' + err);
    } else {
      console.log('👌  Database setup complete');
    }
  });
};
