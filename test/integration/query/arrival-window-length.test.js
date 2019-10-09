const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { Config } = require('../../../lib/data/models');

const testArrivalWindowLength = 5;

describe('arrivalWindowLength Query', () => {
  beforeEach(async done => {
    await sequelize.sync({ force: true })
    await Config.create({
      arrivalWindowLength: testArrivalWindowLength,
      maxTFUPerAppt: 40,
      defaultAllowedApptsPerHour: 5
    });
    done();
  });

  afterAll(async done => {
    await sequelize.sync({ force: true });
    sequelize.close();
    done();
  });

  test('Returns arrivalWindowLength from the database', done => {
    const authToken = jwt.sign({
      userEmail: 'test',
      userRole: 'ADMIN'
    }, process.env.SECRET_KEY);

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `{ arrivalWindowLength }` })
      .then(res => {
        expect(res.body.data.arrivalWindowLength).toBe(testArrivalWindowLength);
        done();
      });
  });

  test('Customer can\'t make this query', done => {
    const authToken = jwt.sign({
      userEmail: 'test',
      userRole: 'CUSTOMER'
    }, process.env.SECRET_KEY);

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `{ arrivalWindowLength }` })
      .then(res => {
        expect(res.body.errors[0].message).toBe('You must be an operator or admin to perform this action');
        done();
      });
  });
});