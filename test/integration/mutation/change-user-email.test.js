const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { User } = require('../../../lib/data/models');

const testUserEmail = 'test@test.com';
const testUserName = 'test';

const testUser = {
  email: testUserEmail,
  password: '1111111',
  role: 'CUSTOMER',
  company: 'Wingworks',
  name: testUserName,
  confirmed: true,
  emailVerified: true,
  reminderSetting: 'EMAIL'
};

const adminAuthToken = jwt.sign({
  userEmail: 'admintestemail',
  userRole: 'ADMIN'
}, process.env.SECRET_KEY);

describe('changeUserEmail Mutation', () => {
  beforeEach(done => {
    sequelize.sync({ force: true })
      .then(() => User.create(testUser))
      .then(() => done());
  });
  
  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });
  
  test('Admin can change user\'s email', done => {
    const newEmail = 'test2@test.com';

    const changeUserEmailInput = `{
      currEmail: "${testUserEmail}",
      newEmail: "${newEmail}"
    }`;

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + adminAuthToken)
      .send({ query: `mutation { changeUserEmail(input: ${changeUserEmailInput}) }` })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.changeUserEmail).toBe(`User ${testUserEmail} changed to ${newEmail}`);

        User.findByPk(newEmail).then(user => {
          expect(user.name).toBe(testUserName)
          done();
        });
      });
  });

  test('Cannot change user\'s email to another user\'s email', async done => {
    const testUser2Email = 'test2@test.com';
    const testUser2Name = 'test2';
    
    const testUser2 = {
      email: testUser2Email,
      password: '1111111',
      role: 'CUSTOMER',
      company: 'Wingworks',
      name: testUser2Name,
      confirmed: true,
      emailVerified: true,
      reminderSetting: 'EMAIL'
    };

    await User.create(testUser2)

    const changeUserEmailInput = `{
      currEmail: "${testUserEmail}",
      newEmail: "${testUser2Email}"
    }`;

    request(server)
    .post('/graphql')
    .set('Authorization', 'Bearer ' + adminAuthToken)
    .send({ query: `mutation { changeUserEmail(input: ${changeUserEmailInput}) }` })
    .expect(200)
    .end((err, res) => {
      expect(res.body.errors[0].message).toBe('User with that email already exists');
      done();
    });
  });

  test('Operator/customer cannot change user\'s email', done => {
    const newEmail = 'test2@test.com';

    const changeUserEmailInput = `{
      currEmail: "${testUserEmail}",
      newEmail: "${newEmail}"
    }`;

    const operatorAuthToken = jwt.sign({
      userEmail: 'operatortestemail',
      userRole: 'OPERATOR'
    }, process.env.SECRET_KEY);

    request(server)
    .post('/graphql')
    .set('Authorization', 'Bearer ' + operatorAuthToken)
    .send({ query: `mutation { changeUserEmail(input: ${changeUserEmailInput}) }` })
    .expect(200)
    .end((err, res) => {
      expect(res.body.errors[0].message).toBe('You must be an admin to perform this action');
      done();
    });
  });
});
