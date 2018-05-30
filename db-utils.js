// set up appointments collection
exports.initAppts = (db) => {
  const coll = db.addCollection('appointments', { unique: ['id'] });
  save(db);
  return coll;
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
