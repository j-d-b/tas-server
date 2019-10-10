const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { User } = require('../../../lib/data/models');

const testUserEmail = 'testuser@test.com';
const testUserName = 'TEST USER';

describe('me Query', () => {
  beforeAll(async done => {
    await sequelize.sync({ force: true })
    await User.create({
      name: testUserName,
      email: testUserEmail,
      company: 'test',
      password: 'test'
    });
    done();
  });

  afterAll(async done => {
    await sequelize.sync({ force: true });
    sequelize.close();
    done();
  });

  test('Returns the requesting user\'s information', done => {
    const authToken = jwt.sign({
      userEmail: testUserEmail,
      userRole: 'ADMIN'
    }, process.env.SECRET_KEY);

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `{ me { name, email } }` })
      .then(res => {
        expect(res.body.data.me.name).toBe(testUserName);
        expect(res.body.data.me.email).toBe(testUserEmail);
        done();
      });
  });
});