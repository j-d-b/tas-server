const { isAuthenticatedResolver } = require('../auth');
const { isValidNumContainersCheck } = require('../checks');
const { getTimeSlotsInNextWeek, slotAvailability } = require('../helpers');

// availableSlots(input: AvailableSlotsInput!): [TimeSlot]
const availableSlots = isAuthenticatedResolver.createResolver(
  async (_, { input: { containerSizes } }, { Appt, Config, Restriction, RestrictionTemplate }) => {
    await isValidNumContainersCheck(containerSizes, Config);

    const availableSlotsInNextWeek = [];

    await Promise.all(getTimeSlotsInNextWeek().map(async (slot) => {
      const isSlotAvailable = await slotAvailability(slot, Appt, Config, Restriction, RestrictionTemplate);
      if (!isSlotAvailable) return;

      availableSlotsInNextWeek.push(slot);
    }));

    return availableSlotsInNextWeek;
  }
);

module.exports = availableSlots;
