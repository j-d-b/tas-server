require('dotenv').config();
require('moment-timezone').tz.setDefault(process.env.TIMEZONE);

const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { User, Appt, Action, Config } = require('../../../lib/data/models');

const newAppt1Id = '12345678';
const newAppt2Id = '910111213';
const newAppt2UserEmail = 'test2@test.com';
const newAppt1Timeslot = {
  hour: 0,
  date: '2020-01-01'
};

const customerAuthToken = jwt.sign({
  userEmail: 'test',
  userRole: 'CUSTOMER'
}, process.env.SECRET_KEY);

describe('appts Query', () => {
  beforeAll(done => {
    sequelize.sync({ force: true })
      .then(() => {
        return User.bulkCreate([
          {
            email: 'test@test.com',
            name: 'test',
            company: 'test',
            password: 'test' 
          },
          {
            email: newAppt2UserEmail,
            name: 'test',
            company: 'test',
            password: 'test' 
          }
        ])
      })
      .then(() => {
        return Appt.bulkCreate([
          {
            id: newAppt1Id,
            userEmail: 'test@test.com',
            timeSlot: newAppt1Timeslot,
            arrivalWindowSlot: 0,
            arrivalWindowLength: 15
          },
          {
            id: newAppt2Id,
            userEmail: newAppt2UserEmail,
            timeSlot: {
              hour: 1,
              date: '2020-01-03'
            },
            arrivalWindowSlot: 0,
            arrivalWindowLength: 15
          }
        ]);
      })
      .then(() => {
        return Action.bulkCreate([
          {
            apptId: newAppt1Id,
            type: 'IMPORT_FULL',
            containerId: '9f9h239fhsd',
            formNumber705: 'FORM239r0j23',
            containerSize: 'TWENTYFOOT'
          },
          {
            apptId: newAppt1Id,
            type: 'STORAGE_EMPTY',
            containerSize: 'TWENTYFOOT',
            containerType: 'Sealtype',
            shippingLine: 'Willow',
            emptyForCityFormNumber: 'form2i38r923r'
          },
          {
            apptId: newAppt2Id,
            type: 'STORAGE_EMPTY',
            containerSize: 'TWENTYFOOT',
            containerType: 'Sealtype',
            shippingLine: 'Willow',
            emptyForCityFormNumber: 'form2i38r923r'
          }
        ]);
      })
      .then(() => {
        return Config.create({
          arrivalWindowLength: 5,
          maxTFUPerAppt: 40,
          defaultAllowedApptsPerHour: 5,
          apptsQueryMaxCount: 500
        });
      }).then(() => done());
  });

  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });

  // TODO test that appts can't return more than the `apptsQueryMaxCount`

  test('appts query can return all appts in the database', done => {
    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + customerAuthToken)
      .send({ query: `{ appts(input: { where: {} }) { id } }` })
      .then(res => {
        expect(res.body.data.appts.length).toBe(2);

        Appt.findByPk(res.body.data.appts[0].id)
          .then(appt => {
            expect(appt).toBeDefined();
            return Appt.findByPk(res.body.data.appts[1].id);
          }).then(appt => {
            expect(appt).toBeDefined();
            done();
          });
      });
  });

  test('appts query can return all appts after a given timeslot', done => {
    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + customerAuthToken)
      .send({ query: `{ appts(input: { fromTimeSlot: { date: "2020-01-02", hour: 0 } }) { id } }` })
      .then(res => {
        expect(res.body.data.appts.length).toBe(1);
        expect(res.body.data.appts[0].id).toBe(newAppt2Id);
        done();
      });
  });

  test('appts query can return all appts before a given date', done => {
    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + customerAuthToken)
      .send({ query: `{ appts(input: { toTimeSlot: { date: "2020-01-02", hour: 0 } }) { id } }` })
      .then(res => {
        expect(res.body.data.appts.length).toBe(1);
        expect(res.body.data.appts[0].id).toBe(newAppt1Id);
        done();
      });
  });

  test('appts query can return all appts of a given action type', async done => {
    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + customerAuthToken)
      .send({ query: `{ appts(input: { where: { actionType: IMPORT_FULL } }) { id } }` })
      .then(res => {
        expect(res.body.data.appts.length).toBe(1);
        expect(res.body.data.appts[0].id).toBe(newAppt1Id);
        
        return request(server)
        .post('/graphql')
        .set('Authorization', 'Bearer ' + customerAuthToken)
        .send({ query: `{ appts(input: { where: { actionType: STORAGE_EMPTY } }) { id } }` })
      }).then(res => {
        expect(res.body.data.appts.length).toBe(2);
        done();
      });
  });

  test('appts query can return all appts for a given user', done => {
    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + customerAuthToken)
      .send({ query: `{ appts(input: { where: { userEmail: "${newAppt2UserEmail}" } }) { id } }` })
      .then(res => {
        expect(res.body.data.appts.length).toBe(1);
        expect(res.body.data.appts[0].id).toBe(newAppt2Id);
        done();
      });
  });

  test('appts query can combine where parameters (matching appts must satisfy both parameters)', async done => {
    request(server)
    .post('/graphql')
    .set('Authorization', 'Bearer ' + customerAuthToken)
    .send({ query: `{ appts(input: { where: { actionType: EXPORT_FULL, userEmail: "${newAppt2UserEmail}" } }) { id } }` }) 
    .then(res => {
      expect(res.body.data.appts.length).toBe(0);

      return request(server)
        .post('/graphql')
        .set('Authorization', 'Bearer ' + customerAuthToken)
        .send({ query: `{ appts(input: { where: { userEmail: "${newAppt2UserEmail}", actionType: STORAGE_EMPTY } }) { id } }` });
    }).then(res => {
      expect(res.body.data.appts.length).toBe(1);
      expect(res.body.data.appts[0].id).toBe(newAppt2Id);
      done();
    });
  });

  test('unauthorized user can\'t get this query', done => {
    request(server)
      .post('/graphql')
      .send({ query: `{ appts(input: {}) { id } }` })
      .then(res => {
        expect(res.body.errors[0].message).toBe('You must be authenticated to perform this action');
        done();
      });
  });
});