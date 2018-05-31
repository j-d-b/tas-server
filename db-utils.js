exports.initDb = (db) => {
  console.log('⚙️  Initializing database')
  db.addCollection('appointments', { unique: ['id'] });
  db.addCollection('users', { unique: ['email'] });
  db.saveDatabase(err => {
    if (err) {
      console.log('⚠️  Error saving database: ' + err);
    } else {
      console.log('👌  Database setup complete, exiting...');
    }
  });
}

// saves the database to memory
exports.saveDb = (db) => {
  db.saveDatabase(err => {
    if (err) {
      console.log('⚠️  Error saving database: ' + err);
    } else {
      console.log('👌  Database saved successfully');
    }
  });
}
