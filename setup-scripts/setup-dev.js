require('dotenv').config();

const loki = require('lokijs');
const bcrypt = require('bcrypt');
const chalk = require('chalk');

const db = new loki('db.json', {
  autosave: true,
  autosaveInterval: 4000 // currently arbitrary
});

console.log(chalk.yellow('------- Development Mode -------'));

console.log('⚙️  Initializing database');
console.log('Adding collections:');

db.addCollection('appointments', { unique: ['id'] });
console.log('appointments...');

db.addCollection('users', { unique: ['email'] });
console.log('users...');

const sampleUsers = [
  {
    email: 'robert@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'customer',
    company: 'Wingworks',
    name: 'Robert Frost'
  },
  {
    email: 'william@hotmail.com',
    password: bcrypt.hashSync('robertfrost', 10),
    role: 'customer',
    company: 'Wingworks',
    name: 'William Wood'
  },
  {
    email: 'sam@trees.net',
    password: bcrypt.hashSync('greenforest', 10),
    role: 'operator',
    company: 'TerminalTrue',
    name: 'Samuel Gardner'
  },
  {
    email: 'cory@mmt.net',
    password: bcrypt.hashSync('greatbaseball', 10),
    role: 'customer',
    company: 'Corigate Group',
    name: 'Cory Roberts'
  },
  {
    email: 'jacob@jdbrady.info',
    password: bcrypt.hashSync('dragonspark', 10),
    role: 'admin',
    company: 'KCUS',
    name: 'Jacob Brady'
  }
];

const sampleAppts = [
  {
    user: 'robert@gmail.com',
    time: '',
    block: 'A',
    type: 'export-full'
  },
  {
    user: 'robert@gmail.com',
    time: '',
    block: 'B',
    type: 'export-full'
  },
  {
    user: 'william@hotmail.com',
    time: '',
    block: 'C',
    type: 'export-full'
  },
  {
    user: 'william@hotmail.com',
    time: '',
    block: 'A',
    type: 'export-empty'
  },
  {
    user: 'cory@mmt.net',
    time: '',
    block: 'C',
    type: 'import-empty'
  },
  {
    user: 'cory@mmt.net',
    time: '',
    block: 'C',
    type: 'export-full'
  },
  {
    user: 'cory@mmt.net',
    time: '',
    block: 'A',
    type: 'import-full'
  },
];

console.log('Adding sample data:');

const appts = db.getCollection('appointments');
const users = db.getCollection('users');

console.log('appointments...')
for (const apptDetails of sampleAppts) {
  const newAppt = appts.insert(apptDetails);
  newAppt.id = newAppt.$loki; // use $loki as ID
  appts.update(newAppt);
}

console.log('users...');
users.insert(sampleUsers);

process.exit(0);
