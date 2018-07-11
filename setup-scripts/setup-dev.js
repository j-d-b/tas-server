require('dotenv').config();

const loki = require('lokijs');
const LokiFSSA = require('lokijs/src/loki-fs-structured-adapter'); // see https://github.com/techfort/LokiJS/wiki/LokiJS-persistence-and-adapters
const bcrypt = require('bcrypt');
const chalk = require('chalk');

const db = new loki('database/db.json', {
  adapter: new LokiFSSA(),
  autosave: true,
  autosaveInterval: 4000 // currently arbitrary
});

console.log(chalk.magenta('------- Development Mode -------'));

console.log(chalk.green('⚙️  Initializing database'));

console.log(chalk.yellow('Adding collections:'));

db.addCollection('appointments');
console.log('appointments...');

db.addCollection('users', { unique: ['email'] });
console.log('users...');

db.addCollection('blocks', { unique: ['id'] });
console.log(chalk.yellow('blocks...'));

const sampleUsers = [
  {
    email: 'robert@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'CUSTOMER',
    company: 'Wingworks',
    name: 'Robert Frost',
    confirmed: true,
    emailVerified: true
  },
  {
    email: 'william@hotmail.com',
    password: bcrypt.hashSync('robertfrost', 10),
    role: 'CUSTOMER',
    company: 'Wingworks',
    name: 'William Wood',
    confirmed: true,
    emailVerified: true
  },
  {
    email: 'sam@trees.net',
    password: bcrypt.hashSync('greenforest', 10),
    role: 'OPERATOR',
    company: 'TerminalTrue',
    name: 'Samuel Gardner',
    confirmed: true,
    emailVerified: true
  },
  {
    email: 'cory@mmt.net',
    password: bcrypt.hashSync('greatbaseball', 10),
    role: 'CUSTOMER',
    company: 'Corigate Group',
    name: 'Cory Roberts',
    confirmed: true,
    emailVerified: true
  },
  {
    email: 'jacob@jdbrady.info',
    password: bcrypt.hashSync('dragonspark', 10),
    role: 'ADMIN',
    company: 'KCUS',
    name: 'Jacob Brady',
    confirmed: true,
    emailVerified: true
  },
  {
    email: 'jbrady@kcus.org',
    password: bcrypt.hashSync('000000', 10),
    role: 'OPERATOR',
    company: 'KCUS',
    name: 'Jacob Brady',
    confirmed: false,
    emailVerified: false
  }
];

const sampleAppts = [
  {
    userEmail: 'robert@gmail.com',
    timeSlot: {
      hour: 10,
      date: '2018-09-15'
    },
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
    timeSlot: {
      hour: 10,
      date: '2018-09-14'
    },
    block: 'B',
    type: 'EXPORTEMPTY',
    typeDetails: {
      containerID: '9hsdf923',
      containerSize: 'FOURTYFOOT'
    }
  },
  {
    userEmail: 'william@hotmail.com',
    timeSlot: {
      hour: 23,
      date: '2018-09-13'
    },
    block: 'C',
    type: 'IMPORTFULL',
    typeDetails: {
      containerID: '9f9h239fhsd',
      formNumber705: 'FORM239r0j23'
    }
  },
  {
    userEmail: 'william@hotmail.com',
    timeSlot: {
      hour: 16,
      date: '2018-09-12'
    },
    block: 'A',
    type: 'EXPORTEMPTY',
    typeDetails: {
      containerID: 'jf21j1f3f2',
      containerSize: 'TWENTYFOOT'
    }
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: {
      hour: 13,
      date: '2018-09-12'
    },
    block: 'C',
    type: 'IMPORTEMPTY',
    typeDetails: {
      containerSize: 'TWENTYFOOT',
      emptyForCityFormNum: 'form2i38r923r'
    }
  },
  {
    userEmail: 'cory@mmt.net',
    timeSlot: {
      hour: 12,
      date: '2018-09-11'
    },
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
    timeSlot: {
      hour: 12,
      date: '2018-09-11'
    },
    block: 'A',
    type: 'IMPORTFULL',
    typeDetails: {
      containerID: 'udfhd7f7d',
      formNumber705: 'FORMio2h38hf'
    }
  },
];

const sampleBlocks = [
  {
    id: 'A',
    maxAllowedApptsPerHour: 10,
    allowedApptsPerHour: 8
  },
  {
    id: 'B',
    maxAllowedApptsPerHour: 15,
    allowedApptsPerHour: 15
  },
  {
    id: 'C',
    maxAllowedApptsPerHour: 10,
    allowedApptsPerHour: 5
  }
];

console.log(chalk.yellow('Adding sample data:'));

const appts = db.getCollection('appointments');
const users = db.getCollection('users');
const blocks = db.getCollection('blocks');

console.log('appointments...');
appts.insert(sampleAppts);

console.log('users...');
users.insert(sampleUsers);

console.log('blocks...');
blocks.insert(sampleBlocks);

db.saveDatabase(err => {
  if (err) {
    throw new Error('⚠️  Error saving database: ' + err);
  } else {
    console.log('👌  Database setup complete');
    process.exit(0);
  }
});
