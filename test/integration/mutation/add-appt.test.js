const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { Appt, Config, User, Action, Restriction } = require('../../../lib/data/models');

const timeSlotDate = '2020-01-01';
const timeSlotHour = 1;
const plateNum = 'test_plate_num';
const comment = 'test_comment';

const authToken = jwt.sign({
  userEmail: 'test@test',
  userRole: 'ADMIN'
}, process.env.SECRET_KEY);
 
const validAddApptInput = `
  {
    timeSlot: {
      date: "${timeSlotDate}",
      hour: ${timeSlotHour}
    },
    licensePlateNumber: "${plateNum}",
    comment: "${comment}",
    actions: [
      { 
        type: IMPORT_FULL,
        importFull: { containerId: "test_id", formNumber705: "test_form_num" }
      }
    ]
  }
`;

describe('addAppt Mutation', () => {
  beforeEach(done => {
    sequelize.sync({ force: true })
      .then(() => Config.create({ defaultAllowedApptsPerHour: 10, maxTFUPerAppt: 40, arrivalWindowLength: 5, apptsQueryMaxCount: 500 }))
      .then(() => User.create({ email: 'test@test', name: 'test', company: 'test', password: 'test' }))
      .then(() => done());
  });
  
  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });
  
  test('Registered user can add an appointment; all details save successfully', done => {
    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `mutation { addAppt(input: ${validAddApptInput}) { id } }` })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.addAppt.id).toBeTruthy();
        
        Appt.findByPk(res.body.data.addAppt.id).then(appt => {
          expect(appt.timeSlot.date).toEqual(timeSlotDate);
          expect(appt.timeSlot.hour).toEqual(timeSlotHour);
          expect(appt.licensePlateNumber).toEqual(plateNum);
          expect(appt.comment).toEqual(comment);
          
          return Action.findAll({ where: { apptId: res.body.data.addAppt.id } });
        }).then(actions => {
          expect(actions.length).toBe(1);
          expect(actions[0].type).toEqual('IMPORT_FULL')
          done();
        });
      });
  });

  test('Unregistered user cannot add an appointment', done => {
    request(server)
    .post('/graphql')
    .send({ query: `mutation { addAppt(input: ${validAddApptInput}) { id } }` })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      res.body.errors[0].message;
      expect(res.body.errors[0].message).toBe('You must be authenticated to perform this action');
      done();
    });
  });

  test('Action must match provide the appropriate type details', done => {
    const invalidAddApptInput = `
      {
        timeSlot: {
          date: "${timeSlotDate}",
          hour: ${timeSlotHour}
        },
        licensePlateNumber: "${plateNum}",
        comment: "${comment}",
        actions: [
          { 
            type: IMPORT_FULL
          }
        ]
      }
    `;

    request(server)
    .post('/graphql')
    .set('Authorization', 'Bearer ' + authToken)
    .send({ query: `mutation { addAppt(input: ${invalidAddApptInput}) { id } }` })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body.errors[0].message).toBe('You must provide the required type-specific action details');
      done();
    });
  });

  test('Appt booking is subject to global gate capacity restrictions', async done => {
    const restriction = await Restriction.create({ type: 'GLOBAL', gateCapacity: 0 });
    await restriction.update({ timeSlot: { hour: timeSlotHour, date: timeSlotDate } });

    request(server)
    .post('/graphql')
    .set('Authorization', 'Bearer ' + authToken)
    .send({ query: `mutation { addAppt(input: ${validAddApptInput}) { id } }` })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body.errors[0].message).toBe('The appointment(s) cannot be scheduled for this time slot');
      done();
    });
  });
});
