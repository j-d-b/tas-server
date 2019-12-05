const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { User } = require('../../../lib/data/models');

const testUserName = 'TEST TEMPLATE';
const testUserEmail = 'test@test.test';
const testUserCompany = 'TEST COMPANY';

const addUserInput = password => `
  {
    name: "${testUserName}",
    email: "${testUserEmail}",
    company: "${testUserCompany}",
    password: "${password}"
  }
`;

describe('addUser Mutation', () => {
  beforeEach(done => {
    sequelize.sync({ force: true })
      .then(() => done());
  });
  
  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });
  
  test('addUser mutation adds a new user to the database', done => {
    request(server)
      .post('/graphql')
      .send({ query: `mutation { addUser(input: ${addUserInput('000000')}) { email } }` })
      .expect(200)
      .then(res => {
        expect(res.body.data.addUser.email).toBe(testUserEmail);

        return User.findById(testUserEmail);
      }).then(user => {
        expect(user.name).toBe(testUserName);
        expect(user.company).toBe(testUserCompany);
        expect(user.confirmed).toBe(false);
        expect(user.emailVerified).toBe(false);
        done();
      });
  });

  test('New user password must not be less than 6 characters', done => {
    request(server)
      .post('/graphql')
      .send({ query: `mutation { addUser(input: ${addUserInput('')}) { email } }` })
      .expect(200)
      .end((err, res) => {
        expect(res.body.errors[0].message).toBe('Password must be at least 6 characters');

        User.findById(testUserEmail).then(user => {
          expect(user).toBeNull();
          done();
        });
      });
  });

  test('Cannot add two users with the same email', done => {
    request(server)
      .post('/graphql')
      .send({ query: `mutation { addUser(input: ${addUserInput('000000')}) { email } }` })
      .expect(200)
      .then(res => {
        expect(res.body.data.addUser.email).toBe(testUserEmail);

        return request(server)
          .post('/graphql')
          .send({ query: `mutation { addUser(input: ${addUserInput('000000')}) { email } }` })
          .expect(200);
      }).then(res => {
        expect(res.body.errors[0].message).toBe('User with that email already exists');
        done();
      });
  });

  // test('New user password is hashed') // TODO
});
