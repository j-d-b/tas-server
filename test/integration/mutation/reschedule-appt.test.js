const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { Appt, Config, User, Action, Restriction } = require('../../../lib/data/models');


const authToken = jwt.sign({
  userEmail: 'test@test',
  userRole: 'ADMIN'
}, process.env.SECRET_KEY);
 
const apptId = 1;
const timeSlotDate = '2020-02-01';
const timeSlotHour = 5;

const validRescheduleApptInput = `
  {
    id: ${apptId}
    timeSlot: {
      date: "${timeSlotDate}",
      hour: ${timeSlotHour}
    }
  }
`;

describe('rescheduleAppt Mutation', () => {
  beforeEach(done => {
    sequelize.sync({ force: true })
      .then(() => Config.create({ defaultAllowedApptsPerHour: 10, maxTFUPerAppt: 40, arrivalWindowLength: 5, apptsQueryMaxCount: 500 }))
      .then(() => User.create({ email: 'test@test', name: 'test', company: 'test', password: 'test' }))
      .then(() => Appt.create({ id: apptId, timeSlot: { hour: 1, date: '2020-01-01' }, arrivalWindowLength: 5, arrivalWindowSlot: 0, userEmail: 'test@test' }))
      .then(() => done());
  });
  
  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });
  
  test('Registered user can reschedule an appointment', done => {
    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `mutation { rescheduleAppt(input: ${validRescheduleApptInput}) { id } }` })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.rescheduleAppt.id).toBeTruthy();
        
        Appt.findByPk(res.body.data.rescheduleAppt.id).then(appt => {
          expect(appt.timeSlot.date).toEqual(timeSlotDate);
          expect(appt.timeSlot.hour).toEqual(timeSlotHour);
          done();
        });
      });
  });

  test('Unregistered user cannot reschedule an appointment', done => {
    request(server)
    .post('/graphql')
    .send({ query: `mutation { rescheduleAppt(input: ${validRescheduleApptInput}) { id } }` })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      res.body.errors[0].message;
      expect(res.body.errors[0].message).toBe('You must be authenticated to perform this action');
      done();
    });
  });

  test('Rescheduling is subject to global gate capacity restrictions', async done => {
    const restriction = await Restriction.create({ type: 'GLOBAL', gateCapacity: 0 });
    await restriction.update({ timeSlot: { hour: timeSlotHour, date: timeSlotDate } });

    request(server)
    .post('/graphql')
    .set('Authorization', 'Bearer ' + authToken)
    .send({ query: `mutation { rescheduleAppt(input: ${validRescheduleApptInput}) { id } }` })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body.errors[0].message).toBe('The appointment(s) cannot be scheduled for this time slot');
      done();
    });
  });
});
