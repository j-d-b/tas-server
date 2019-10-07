const request = require('supertest');
const bcrypt = require('bcrypt');

const server = require('../../lib/server');
const sequelize = require('../../lib/data/sequelize');
const { User } = require('../../lib/data/models');

const sampleAdminPassword = '000000';
const sampleAdmin =   {
  email: 'jbrady@kcus.org',
  password: bcrypt.hashSync(sampleAdminPassword, 10),
  role: 'ADMIN',
  company: 'KCUS',
  name: 'Jacob Brady',
  mobileNumber: '12074007898',
  confirmed: true,
  emailVerified: true,
  reminderSetting: 'BOTH'
};

beforeAll(done => {
  sequelize.sync({ force: true })
    .then(() => User.create(sampleAdmin))
    .then(() => {
      done();
    });
});

afterAll(() => sequelize.close());

describe('Login Mutation', () => {
  test('Registered user can login', done => {
    request(server)
      .post('/graphql')
      .send({ query: `mutation { login(input: { email: "${sampleAdmin.email}", password: "${sampleAdminPassword}" }) }` })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.login).toBeTruthy();
        done();
      });
  });

  test('Non-existing user cannot login', done => {
    request(server)
      .post('/graphql')
      .send({ query: 'mutation { login(input: { email: "FAKEUSER", password: "RANDOMPASSWORD" }) }' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors[0].message).toBe('No user with that email exists');
        done();
      });
  });

  test('Incorrect password user cannot login', done => {
    request(server)
      .post('/graphql')
      .send({ query: `mutation { login(input: { email: "${sampleAdmin.email}", password: "WRONGPASSWORD" }) }` })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors[0].message).toBe('Incorrect password');
        done();
      });
  });
});
