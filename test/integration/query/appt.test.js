require('dotenv').config();

const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { User, Appt } = require('../../../lib/data/models');

const newApptId = '12345678';

describe('appt Query', () => {
  beforeAll(done => {
    sequelize.sync({ force: true })
      .then(() => {
        return User.create({
          email: 'test@test.com',
          name: 'test',
          company: 'test',
          password: 'test' 
        })
      })
      .then(() => {
        return Appt.create({
          id: newApptId,
          userEmail: 'test@test.com',
          timeSlot: {
            hour: 0,
            date: '2020-01-01'
          },
          arrivalWindowSlot: 0,
          arrivalWindowLength: 15
        });
      })
      .then(() => done());
  });

  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });

  test('appt query returns appt by id', done => {
    const authToken = jwt.sign({
      userEmail: 'test',
      userRole: 'CUSTOMER'
    }, process.env.SECRET_KEY);

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `{ appt(input: { id: ${newApptId}}) { id } }` })
      .then(res => {
        expect(res.body.data.appt.id).toBe(newApptId);
        return Appt.findByPk(newApptId);
      }).then(appt => {
        expect(String(appt.id)).toBe(newApptId); // it's a number when it comes from the database
        done();
      });
  });

  test('unauthorized user can\'t get this query', done => {
    request(server)
      .post('/graphql')
      .send({ query: `{ appt(input: { id: ${newApptId}}) { id } }` })
      .then(res => {
        expect(res.body.errors[0].message).toBe('You must be authenticated to perform this action');
        done();
      });
  });
});