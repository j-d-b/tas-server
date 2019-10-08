const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { User, Restriction } = require('../../../lib/data/models');

const testTimeSlotDate = '2020-01-01';
const testTimeSlotHour = 0;
const testGateCapacity = 1;

const addGlobalRestrictionsInput = `
  [{
    gateCapacity: ${testGateCapacity},
    timeSlot: {
      hour: ${testTimeSlotHour},
      date: "${testTimeSlotDate}"
    }
  }]
`;

const adminAuthToken = jwt.sign({
  userEmail: 'test',
  userRole: 'ADMIN'
}, process.env.SECRET_KEY);

describe('addGlobalRestrictions Mutation', () => {
  beforeEach(done => {
    sequelize.sync({ force: true })
      .then(() => User.create({ email: 'test', name: 'test', company: 'test', password: 'test' }))
      .then(() => done());
  });
  
  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });
  
  test('Admin can add a global restriction', done => {
    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + adminAuthToken)
      .send({ query: `mutation { addGlobalRestrictions(input: ${addGlobalRestrictionsInput}) { id } }` })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.addGlobalRestrictions.length).toEqual(1);
        expect(res.body.data.addGlobalRestrictions[0].id).toBeTruthy();
        
        Restriction.findById(res.body.data.addGlobalRestrictions[0].id).then(restriction => {
          expect(restriction.timeSlot.date).toEqual(testTimeSlotDate);
          expect(restriction.timeSlot.hour).toEqual(testTimeSlotHour);
          expect(restriction.gateCapacity).toEqual(testGateCapacity);
          done();          
        });
      });
  });

  test('Operator can add a global restriction', done => {
    const authToken = jwt.sign({
      userEmail: 'test',
      userRole: 'OPERATOR'
    }, process.env.SECRET_KEY);

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `mutation { addGlobalRestrictions(input: ${addGlobalRestrictionsInput}) { id } }` })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.addGlobalRestrictions.length).toEqual(1);
        expect(res.body.data.addGlobalRestrictions[0].id).toBeTruthy();
        
        Restriction.findById(res.body.data.addGlobalRestrictions[0].id).then(restriction => {
          expect(restriction.timeSlot.date).toEqual(testTimeSlotDate);
          expect(restriction.timeSlot.hour).toEqual(testTimeSlotHour);
          expect(restriction.gateCapacity).toEqual(testGateCapacity);
          done();          
        });
      });
  });


  test('Customer cannot add a global restriction', done => {
    let authToken = jwt.sign({
      userEmail: 'test',
      userRole: 'CUSTOMER'
    }, process.env.SECRET_KEY);

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `mutation { addGlobalRestrictions(input: ${addGlobalRestrictionsInput}) { id } }` })
      .expect(200)
      .end((err, res) => {
        expect(res.body.errors[0].message).toEqual('You must be an operator or admin to perform this action');
        done();
      });
  });

  test('Can add multiple restrictions in one requestion', done => {
    const testTimeSlotDate2 = '2020-01-02';
    const testTimeSlotHour2 = 1;
    const testGateCapacity2 = 2;
    
    const addGlobalRestrictionsInput2 = `
      [
        {
          gateCapacity: ${testGateCapacity},
          timeSlot: {
            hour: ${testTimeSlotHour},
            date: "${testTimeSlotDate}"
          }
        },
        {
          gateCapacity: ${testGateCapacity2},
          timeSlot: {
            hour: ${testTimeSlotHour2},
            date: "${testTimeSlotDate2}"
          }
        }
      ]
    `;

    request(server)
    .post('/graphql')
    .set('Authorization', 'Bearer ' + adminAuthToken)
    .send({ query: `mutation { addGlobalRestrictions(input: ${addGlobalRestrictionsInput2}) { id } }` })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body.data.addGlobalRestrictions.length).toEqual(2);

      Restriction.findById(res.body.data.addGlobalRestrictions[0].id).then(restriction => {
        expect(restriction.timeSlot.date).toEqual(testTimeSlotDate);
        expect(restriction.timeSlot.hour).toEqual(testTimeSlotHour);
        expect(restriction.gateCapacity).toEqual(testGateCapacity);

        return Restriction.findById(res.body.data.addGlobalRestrictions[1].id);
      }).then(restriction => {
        expect(restriction.timeSlot.date).toEqual(testTimeSlotDate2);
        expect(restriction.timeSlot.hour).toEqual(testTimeSlotHour2);
        expect(restriction.gateCapacity).toEqual(testGateCapacity2);
        done();          
      });
    });
  });

  test('Cannot add two restrictions in the same timeslot', done => {
    const addGlobalRestrictionsInput2 = `
      [
        {
          gateCapacity: ${testGateCapacity},
          timeSlot: {
            hour: ${testTimeSlotHour},
            date: "${testTimeSlotDate}"
          }
        },
        {
          gateCapacity: ${testGateCapacity},
          timeSlot: {
            hour: ${testTimeSlotHour},
            date: "${testTimeSlotDate}"
          }
        }
      ]
    `;

    request(server)
    .post('/graphql')
    .set('Authorization', 'Bearer ' + adminAuthToken)
    .send({ query: `mutation { addGlobalRestrictions(input: ${addGlobalRestrictionsInput2}) { id } }` })
    .expect(200)
    .end((err, res) => {
      expect(res.body.errors[0].message).toEqual('Multiple restrictions must not apply to same timeslot or day/time');
      Restriction.findOne().then(restriction => {
        expect(restriction).toBeNull();
        done();
      });
    });
  });

  test('Adding a new restriction in the same timeslot of an existing restriction updates the existing restriction', done => {
    request(server)
    .post('/graphql')
    .set('Authorization', 'Bearer ' + adminAuthToken)
    .send({ query: `mutation { addGlobalRestrictions(input: ${addGlobalRestrictionsInput}) { id } }` })
    .expect(200)
    .then(res => {
      expect(res.body.data.addGlobalRestrictions.length).toEqual(1);
      expect(res.body.data.addGlobalRestrictions[0].id).toBeTruthy();
      
      return Restriction.findById(res.body.data.addGlobalRestrictions[0].id);
    }).then(restriction => {
      expect(restriction.timeSlot.date).toEqual(testTimeSlotDate);
      expect(restriction.timeSlot.hour).toEqual(testTimeSlotHour);
      expect(restriction.gateCapacity).toEqual(testGateCapacity);

      const testGateCapacity2 = 10;

      const addGlobalRestrictionsInput2 = `
        [{
          gateCapacity: ${testGateCapacity2},
          timeSlot: {
            hour: ${testTimeSlotHour},
            date: "${testTimeSlotDate}"
          }
        }]
      `;

      request(server)
        .post('/graphql')
        .set('Authorization', 'Bearer ' + adminAuthToken)
        .send({ query: `mutation { addGlobalRestrictions(input: ${addGlobalRestrictionsInput2}) { id } }` })
        .expect(200)
        .then(res => {
          expect(res.body.data.addGlobalRestrictions.length).toEqual(1);
          expect(res.body.data.addGlobalRestrictions[0].id).toBeTruthy();
          
          Restriction.findById(res.body.data.addGlobalRestrictions[0].id).then(restriction => {
            expect(restriction.timeSlot.date).toEqual(testTimeSlotDate);
            expect(restriction.timeSlot.hour).toEqual(testTimeSlotHour);
            expect(restriction.gateCapacity).toEqual(testGateCapacity2);
            done();          
          });
        });
    });
  });
});
