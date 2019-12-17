require('dotenv').config();

const request = require('supertest');
const jwt = require('jsonwebtoken');

const server = require('../../../lib/server');
const sequelize = require('../../../lib/data/sequelize');
const { User, Restriction, RestrictionTemplate } = require('../../../lib/data/models');

const testTemplateName = 'TEST TEMPLATE';
const testGateCapacity = 1;
const testHour = 1;
const testDayOfWeek = 'MONDAY';

const addRestrictionTemplateInput = `
  {
    name: "${testTemplateName}",
    restrictions: [{
      gateCapacity: ${testGateCapacity},
      hour: ${testHour},
      dayOfWeek: ${testDayOfWeek}
    }]
  }
`;

const adminAuthToken = jwt.sign({
  userEmail: 'test',
  userRole: 'ADMIN'
}, process.env.SECRET_KEY);

describe('addRestrictionTemplate Mutation', () => {
  beforeEach(done => {
    sequelize.sync({ force: true })
      .then(() => done());
  });
  
  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });
  
  test('Admin can add a restriction template', done => {
    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + adminAuthToken)
      .send({ query: `mutation { addRestrictionTemplate(input: ${addRestrictionTemplateInput}) { name } }` })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.addRestrictionTemplate.name).toBe(testTemplateName);

        RestrictionTemplate.findByPk(testTemplateName).then(template => {
          expect(template).not.toBeNull();
          return Restriction.findOne({ where: { template: testTemplateName } });
        }).then(restriction => {
          expect(restriction.hour).toBe(testHour);
          expect(restriction.type).toBe('TEMPLATE');
          expect(restriction.dayOfWeek).toBe(testDayOfWeek);
          expect(restriction.gateCapacity).toBe(testGateCapacity);
          done();
        });
      });
  });

  test('Operator can add a restriction template', done => {
    const authToken = jwt.sign({
      userEmail: 'test',
      userRole: 'OPERATOR'
    }, process.env.SECRET_KEY);

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `mutation { addRestrictionTemplate(input: ${addRestrictionTemplateInput}) { name } }` })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.addRestrictionTemplate.name).toBe(testTemplateName);

        RestrictionTemplate.findByPk(testTemplateName).then(template => {
          expect(template).not.toBeNull();          
          return Restriction.findOne({ where: { template: testTemplateName } });
        }).then(restriction => {
          expect(restriction.hour).toBe(testHour);
          expect(restriction.type).toBe('TEMPLATE');
          expect(restriction.dayOfWeek).toBe(testDayOfWeek);
          expect(restriction.gateCapacity).toBe(testGateCapacity);
          done();
        });
      });
  });

  test('Customer cannot add a restriction template', done => {
    const authToken = jwt.sign({
      userEmail: 'test',
      userRole: 'CUSTOMER'
    }, process.env.SECRET_KEY);

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + authToken)
      .send({ query: `mutation { addRestrictionTemplate(input: ${addRestrictionTemplateInput}) { name } }` })
      .expect(200)
      .end((err, res) => {
        expect(res.body.errors[0].message).toBe('You must be an operator or admin to perform this action');
        done();
      });
  });

  test('Restriction template names must be unique', done => {
    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + adminAuthToken)
      .send({ query: `mutation { addRestrictionTemplate(input: ${addRestrictionTemplateInput}) { name } }` })
      .expect(200)
      .then(res => {
        expect(res.body.data.addRestrictionTemplate.name).toBe(testTemplateName);

        return request(server)
          .post('/graphql')
          .set('Authorization', 'Bearer ' + adminAuthToken)
          .send({ query: `mutation { addRestrictionTemplate(input: ${addRestrictionTemplateInput}) { name } }` })
          .expect(200);
      }).then(res => {
        expect(res.body.errors[0].message).toBe('The given template name is already in use');
        done();
      });
  });

  test('Cannot add a template with two restrictions in the same timeslot', done => {
    const addRestrictionTemplateWithDupRestrictions = `
      {
        name: "TEST",
        restrictions: [
          {
            gateCapacity: 1,
            hour: 0,
            dayOfWeek: WEDNESDAY
          },
          {
            gateCapacity: 1,
            hour: 0,
            dayOfWeek: WEDNESDAY
          }
        ]
      }
    `;

    request(server)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + adminAuthToken)
      .send({ query: `mutation { addRestrictionTemplate(input: ${addRestrictionTemplateWithDupRestrictions}) { name } }` })
      .expect(200)
      .then(res => {
        expect(res.body.errors[0].message).toEqual('Multiple restrictions must not apply to same timeslot or day/time');

        RestrictionTemplate.findOne().then(template => {
          expect(template).toBeNull();
          done();
        });
      });
  });
});
