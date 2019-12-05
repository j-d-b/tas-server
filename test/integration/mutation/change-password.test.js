const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { User } = require('../../../lib/data/models');

const testUserPassword = 'abcdefg';
const testUserEmail = 'test@test.com';

const sampleUser = {
  email: testUserEmail,
  password: bcrypt.hashSync(testUserPassword, 10),
  role: 'CUSTOMER',
  company: 'Wingworks',
  name: 'Robert Frost',
  confirmed: true,
  emailVerified: true,
  reminderSetting: 'EMAIL'
};

const testUserAuthToken = jwt.sign({
  userEmail: testUserEmail,
  role: 'CUSTOMER'
}, process.env.SECRET_KEY);

describe('changePassword Mutation', () => {
  beforeEach(done => {
    sequelize.sync({ force: true })
      .then(() => User.create(sampleUser))
      .then(() => done());
  });
  
  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });
  
  test('User can change password', done => {
    const newPassword = 'aaaaaa';

    const changePasswordInput = `{
      currPassword: "${testUserPassword}",
      newPassword: "${newPassword}"
    }`;

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + testUserAuthToken)
      .send({ query: `mutation { changePassword(input: ${changePasswordInput}) }` })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.changePassword).toBe('Password updated successfully');

        User.findByPk(testUserEmail).then(user => {
          const isValid = bcrypt.compareSync(newPassword, user.password);
          expect(isValid).toBe(true);
          done();
        });
      });
  });

  test('New password must not be less than 6 characters', done => {
    const newPassword = '';

    const changePasswordInput = `{
      currPassword: "${testUserPassword}",
      newPassword: "${newPassword}"
    }`;

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + testUserAuthToken)
      .send({ query: `mutation { changePassword(input: ${changePasswordInput}) }` })
      .expect(200)
      .end((err, res) => {
        expect(res.body.errors[0].message).toBe('Password must be at least 6 characters');

        User.findByPk(testUserEmail).then(user => {
          const isValid = bcrypt.compareSync(testUserPassword, user.password);
          expect(isValid).toBe(true);
          done();
        });
      });
  });
});
