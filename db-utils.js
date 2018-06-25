
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
