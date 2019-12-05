const request = require('supertest');
const jwt = require('jsonwebtoken');
const { format, startOfToday, subMonths } = require('date-fns');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { User, Appt } = require('../../../lib/data/models');

const newAppt1Id = '12345678';
const newAppt2Id = '91011213';
const newAppt3Id = '00000000';
const testUser1Email = 'test@test.com';
const testUser2Email = 'test2@test.com';

describe('myAppts Query', () => {
  beforeAll(async done => {
    await sequelize.sync({ force: true });
    await User.bulkCreate([
      {
        email: testUser1Email,
        name: 'test',
        company: 'test',
        password: 'test' 
      },
      {
        email: testUser2Email,
        name: 'test2',
        company: 'test2',
        password: 'test2' 
      }
    ]);
    await Appt.bulkCreate([
      {
        id: newAppt1Id,
        userEmail: testUser1Email,
        timeSlot: {
          hour: 0,
          date: format(startOfToday(), 'yyyy-MM-dd')
        },
        arrivalWindowSlot: 0,
        arrivalWindowLength: 15
      },
      {
        id: newAppt2Id,
        userEmail: testUser1Email,
        timeSlot: {
          hour: 0,
          date: format(subMonths(startOfToday(), 2), 'yyyy-MM-dd')
        },
        arrivalWindowSlot: 0,
        arrivalWindowLength: 15
      },
      {
        id: newAppt3Id,
        userEmail: testUser2Email,
        timeSlot: {
          hour: 1,
          date: format(startOfToday(), 'yyyy-MM-dd')
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

  test('myAppts query returns appt for user by email in auth token with timeSlot in the past month', done => {
    const authToken = jwt.sign({
      userEmail: testUser1Email,
      userRole: 'CUSTOMER'
    }, process.env.SECRET_KEY);

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `{ myAppts { id } }` })
      .then(res => {
        expect(res.body.data.myAppts.length).toBe(1);
        expect(res.body.data.myAppts[0].id).toBe(newAppt1Id);
        done();
      });
  });


  test('myAppts query returns [] when user by email in auth token has no appts', done => {
    const authToken = jwt.sign({
      userEmail: 'fake_email',
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