require('dotenv').config();

const loki = require('lokijs');
const bcrypt = require('bcrypt');
const chalk = require('chalk');

const db = new loki('db.json', {
  autosave: true,
  autosaveInterval: 4000 // currently arbitrary
});

console.log(chalk.red('------- Development Mode -------'));

console.log(chalk.green('⚙️  Initializing database'));

console.log(chalk.yellow('Adding collections:'));

db.addCollection('appointments', { unique: ['id'] });
console.log('appointments...');

db.addCollection('users', { unique: ['email'] });
console.log('users...');

const sampleUsers = [
  {
    email: 'robert@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'CUSTOMER',
    company: 'Wingworks',
    name: 'Robert Frost'
  },
  {
    email: 'william@hotmail.com',
    password: bcrypt.hashSync('robertfrost', 10),
    role: 'CUSTOMER',
    company: 'Wingworks',
    name: 'William Wood'
  },
  {
    email: 'sam@trees.net',
    password: bcrypt.hashSync('greenforest', 10),
    role: 'OPERATOR',
    company: 'TerminalTrue',
    name: 'Samuel Gardner'
  },
  {
    email: 'cory@mmt.net',
    password: bcrypt.hashSync('greatbaseball', 10),
    role: 'CUSTOMER',
    company: 'Corigate Group',
    name: 'Cory Roberts'
  },
  {
    email: 'jacob@jdbrady.info',
    password: bcrypt.hashSync('dragonspark', 10),
    role: 'ADMIN',
    company: 'KCUS',
    name: 'Jacob Brady'
  }
];

const sampleAppts = [
  {
    userEmail: 'robert@gmail.com',
    timeSlot: '',
    block: 'A',
    type: 'EXPORTFULL',
    typeDetails: {

    }
  },
  {
    userEmail: 'robert@gmail.com',
    timeSlot: '',
    block: 'B',
    type: 'EXPORTFULL',
    typeDetails: {

    }
  },
  {
    userEmail: 'william@hotmail.com',
    timeSlot: '',
    block: 'C',
    type: 'EXPORTFULL',
    typeDetails: {

    }
  },
  {
    userEmail: 'william@hotmail.com',
    timeSlot: '',
    block: 'A',
    type: 'EXPORTEMPTY',
    typeDetails: {

    }
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: '',
    block: 'C',
    type: 'IMPORTEMPTY',
    typeDetails: {

    }
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: '',
    block: 'C',
    type: 'EXPORTFULL',
    typeDetails: {

    }
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: '',
    block: 'A',
    type: 'IMPORTFULL',
    typeDetails: {

    }
  },
];

console.log(chalk.yellow('Adding sample data:'));

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

db.saveDatabase(err => {
  if (err) {
    throw new Error('⚠️  Error saving database: ' + err);
  } else {
    console.log('👌  Database setup complete');
    process.exit(0);
  }
});
