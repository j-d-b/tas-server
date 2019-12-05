const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { User, Appt } = require('../../../lib/data/models');

const newAppt1Id = '12345678';
const newAppt2Id = '91011213';
const testUserEmail = 'test@test.com';

describe('myAppts Query', () => {
  beforeAll(async done => {
    await sequelize.sync({ force: true });
    await User.create({
      email: testUserEmail,
      name: 'test',
      company: 'test',
      password: 'test' 
    });
    await Appt.bulkCreate([
      {
        id: newAppt1Id,
        userEmail: testUserEmail,
        timeSlot: {
          hour: 0,
          date: '2020-01-01'
        },
        arrivalWindowSlot: 0,
        arrivalWindowLength: 15
      },
      {
        id: newAppt2Id,
        userEmail: testUserEmail,
        timeSlot: {
          hour: 1,
          date: '2020-01-01'
        },
        arrivalWindowSlot: 0,
        arrivalWindowLength: 15
      }
    ]);
    done();
  });

  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });

  test('myAppts query returns appt for user by email in auth token', done => {
    const authToken = jwt.sign({
      userEmail: testUserEmail,
      userRole: 'CUSTOMER'
    }, process.env.SECRET_KEY);

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `{ myAppts { id } }` })
      .then(res => {
        expect(res.body.data.myAppts.length).toBe(2);
        
        const apptIds = res.body.data.myAppts.map(({ id }) => id);
        expect(apptIds).toContain(newAppt1Id);
        expect(apptIds).toContain(newAppt2Id);
        done();
      });
  });

  test('myAppts query returns [] when user by email in auth token has no appts', done => {
    const authToken = jwt.sign({
      userEmail: 'anotherRandomEmail',
      userRole: 'CUSTOMER'
    }, process.env.SECRET_KEY);

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `{ myAppts { id } }` })
      .then(res => {
        expect(res.body.data.myAppts.length).toBe(0);
        done();
      });
  });

  test('Unauthorized user can\'t get this query', done => {
    request(server)
      .post('/graphql')
      .send({ query: `{ myAppts { id } }` })
      .then(res => {
        expect(res.body.errors[0].message).toBe('You must be authenticated to perform this action');
        done();
      });
  });
});