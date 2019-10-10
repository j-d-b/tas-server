require('dotenv').config(); // I don't like having to call this, should be more decoupled

const { slotAvailability } = require('../../lib/graphql/resolvers/helpers');
const sequelize = require('../../lib/data/sequelize');
const { Appt, User, Config, Restriction, RestrictionTemplate } = require('../../lib/data/models');

const timeSlot = {
  date: '2020-01-01',
  hour: 0
};

const timeSlotDayOfWeek = 'WEDNESDAY';

describe('Appointment slot availability', () => {
  beforeAll(done => {
    sequelize.sync({ force: true })
      .then(() => done());
  });
  
  afterAll(done => {
    sequelize.sync({ force: true }).then(() => {
      sequelize.close();
      done();
    });
  });

  test('Slot is available when no restrictions or no other appts in this slot and default allow appts per hour is greater than 0', async () => {
    await Config.create({ defaultAllowedApptsPerHour: 1, maxTFUPerAppt: 40, arrivalWindowLength: 5 });
    const isAvailable = await slotAvailability(timeSlot, Appt, Config, Restriction, RestrictionTemplate);
    expect(isAvailable).toEqual(true);
  });

  test('Slot is unavailable when no restrictions or no other appts in this slot and default allow appts per hour is 0', async () => {
    await Config.create({ defaultAllowedApptsPerHour: 0, maxTFUPerAppt: 40, arrivalWindowLength: 5 });
    const isAvailable = await slotAvailability(timeSlot, Appt, Config, Restriction, RestrictionTemplate);
    expect(isAvailable).toEqual(false);
  });

  test('Slot is available when no other appts and global restriction for the slot is greater than 0', async () => {
    await Restriction.create({ type: 'GLOBAL', gateCapacity: 1, hour: timeSlot.hour, timeSlotDate: timeSlot.date });
    const isAvailable = await slotAvailability(timeSlot, Appt, Config, Restriction, RestrictionTemplate);
    expect(isAvailable).toEqual(true);
  });

  test('Slot is unavailable when no other appts and global restriction for the slot is 0', async () => {
    await Restriction.create({ type: 'GLOBAL', gateCapacity: 0, hour: timeSlot.hour, timeSlotDate: timeSlot.date });
    const isAvailable = await slotAvailability(timeSlot, Appt, Config, Restriction, RestrictionTemplate);
    expect(isAvailable).toEqual(false);
  });

  test('Slot is unavailable when one other appt exists in the slot and global restriction for the slot is 1', async () => {
    await Restriction.create({ type: 'GLOBAL', gateCapacity: 1, hour: timeSlot.hour, timeSlotDate: timeSlot.date });
    await User.create({
      email: 'robert@gmail.com',
      password: 'seals',
      role: 'CUSTOMER',
      company: 'Wingworks',
      name: 'Robert Frost',
      confirmed: true
    });
    await Appt.create({
      userEmail: 'robert@gmail.com',
      timeSlot,
      arrivalWindowSlot: 0,
      arrivalWindowLength: 15
    });
    const isAvailable = await slotAvailability(timeSlot, Appt, Config, Restriction, RestrictionTemplate);
    expect(isAvailable).toEqual(false);
  });

  test('Slot is available when one other appt exists in the slot and and global restriction for the slot 2', async () => {
    await Restriction.create({ type: 'GLOBAL', gateCapacity: 2, hour: timeSlot.hour, timeSlotDate: timeSlot.date });
    await User.create({
      email: 'robert@gmail.com',
      password: 'seals',
      role: 'CUSTOMER',
      company: 'Wingworks',
      name: 'Robert Frost',
      confirmed: true
    });
    await Appt.create({
      userEmail: 'robert@gmail.com',
      timeSlot,
      arrivalWindowSlot: 0,
      arrivalWindowLength: 15
    });
    const isAvailable = await slotAvailability(timeSlot, Appt, Config, Restriction, RestrictionTemplate);
    expect(isAvailable).toEqual(true);
  });

  test('Slot is subject to template restrictions only when there is an applied restriction template with a value for the given slot', async () => {
    await Config.create({ defaultAllowedApptsPerHour: 1, maxTFUPerAppt: 40, arrivalWindowLength: 5 });
    const template = await RestrictionTemplate.create({ name: 'TEST TEMPLATE', isApplied: false });
    await Restriction.create({
      dayOfWeek: timeSlotDayOfWeek,
      hour: timeSlot.hour,
      template: 'TEST TEMPLATE',
      type: 'TEMPLATE',
      gateCapacity: 0
    });

    let isAvailable = await slotAvailability(timeSlot, Appt, Config, Restriction, RestrictionTemplate);
    expect(isAvailable).toEqual(true); // not yet applied

    await template.update({ isApplied: true });

    isAvailable = await slotAvailability(timeSlot, Appt, Config, Restriction, RestrictionTemplate);
    expect(isAvailable).toBe(false);
  });
});