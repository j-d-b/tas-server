require('dotenv').config(); // I don't like having to call this, should be more decoupled

const sequelize = require('../../lib/data/sequelize');
const { isValidNumContainersCheck } = require('../../lib/graphql/resolvers/checks');
const { Config } = require('../../lib/data/models');

describe('isValidNumContainersCheck', () => {
  beforeAll(async done => {
    await sequelize.sync({ force: true });
    await Config.create({ defaultAllowedApptsPerHour: 1, maxTFUPerAppt: 40, arrivalWindowLength: 5 });
    done();
  });

  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });

  test('Expect error when more containers than the config maxTFUPerAppt', async done => {
    expect(isValidNumContainersCheck(['FORTYFOOT', 'TWENTYFOOT'], Config)).rejects.toEqual(new Error('Too many containers (using TFU)'));
    done();
  });

  test('Expect no error when num container equals the config maxTFUPerAppt', async done => {
    expect(isValidNumContainersCheck(['TWENTYFOOT', 'TWENTYFOOT'], Config)).resolves.toBeUndefined();
    expect(isValidNumContainersCheck(['FORTYFOOT'], Config)).resolves.toBeUndefined();
    done();
  });

  test('Expect no error when num container is less than the config maxTFUPerAppt', async done => {
    expect(isValidNumContainersCheck(['TWENTYFOOT'], Config)).resolves.toBeUndefined();
    done();
  });

  test('Expect no error when no containers are givin', async done => {
    expect(isValidNumContainersCheck([], Config)).resolves.toBeUndefined();
    done();
  });
});


