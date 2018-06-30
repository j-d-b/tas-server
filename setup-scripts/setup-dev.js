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
      containerID: '192fh1h2f',
      containerSize: 'TWENTYFOOT',
      containerWeight: 4000,
      bookingNum: 1924192,
      vesselName: 'Blueberry',
      vesselETA: 'Tomorrow',
      destinationPort: 'String!',
      firstPortOfDischarge: 'String!'
    }
  },
  {
    userEmail: 'robert@gmail.com',
    timeSlot: '',
    block: 'B',
    type: 'EXPORTEMPTY',
    typeDetails: {
      containerID: '9hsdf923',
      containerSize: 'FOURTYFOOT'
    }
  },
  {
    userEmail: 'william@hotmail.com',
    timeSlot: '',
    block: 'C',
    type: 'IMPORTFULL',
    typeDetails: {
      containerID: '9f9h239fhsd',
      formNumber705: 'FORM239r0j23'
    }
  },
  {
    userEmail: 'william@hotmail.com',
    timeSlot: '',
    block: 'A',
    type: 'EXPORTEMPTY',
    typeDetails: {
      containerID: 'jf21j1f3f2',
      containerSize: 'TWENTYFOOT'
    }
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: '',
    block: 'C',
    type: 'IMPORTEMPTY',
    typeDetails: {
      containerSize: 'TWENTYFOOT',
      emptyForCityFormNum: 'form2i38r923r'
    }
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: '',
    block: 'C',
    type: 'EXPORTFULL',
    typeDetails: {
      containerID: '2883hf8ttt',
      containerSize: 'TWENTYFOOT',
      containerWeight: 1222,
      bookingNum: 293923,
      vesselName: 'String',
      vesselETA: 'String',
      destinationPort: 'String',
      firstPortOfDischarge: 'String'
    }
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: '',
    block: 'A',
    type: 'IMPORTFULL',
    typeDetails: {
      containerID: 'udfhd7f7d',
      formNumber705: 'FORMio2h38hf'
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
