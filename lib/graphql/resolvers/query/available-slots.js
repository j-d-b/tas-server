const { isAuthenticatedResolver } = require('../auth');
const { isValidNumContainersCheck } = require('../checks');
const { getTimeSlotsInNextWeek, slotAvailability } = require('../helpers');

// availableSlots(input: AvailableSlotsInput!): [TimeSlot]
const availableSlots = isAuthenticatedResolver.createResolver(
  async (_, { input: { containerSizes } }, { Appt, Config, Restriction, RestrictionTemplate }) => {
    await isValidNumContainersCheck(containerSizes, Config);

    const availableSlotInNextWeek = [];

    await Promise.all(getTimeSlotsInNextWeek().map(async (slot) => {
      const isSlotAvailable = await slotAvailability(slot, Appt, Config, Restriction, RestrictionTemplate);
      if (!isSlotAvailable) return;

      availableSlotInNextWeek.push(slot);
    }));

    return availableSlotInNextWeek;
  }
);

module.exports = availableSlots;
