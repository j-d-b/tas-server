const { isAuthenticatedResolver } = require('../auth');
const { isValidNumContainersCheck } = require('../checks');
const { getTimeSlotsInNextWeek, slotAvailability } = require('../helpers');

// availableSlots(input: AvailableSlotsInput!): [TimeSlot]
const availableSlots = isAuthenticatedResolver.createResolver(
  async (_, { input: { importFullContainerIds, knownContainerSizes } }, { Appt, Config, Restriction, RestrictionTemplate }) => {
    const importFullSizes = ['TWENTYFOOT']; // TODO

    const containerSizes = knownContainerSizes.concat(importFullSizes);
    await isValidNumContainersCheck(containerSizes, Config);

    const availableSlotInNextWeek = [];

    await Promise.all(getTimeSlotsInNextWeek().map(async (slot) => {
      const isSlotAvailable = await slotAvailability(slot, containerSizes.length, Appt, Config, Restriction, RestrictionTemplate);
      if (!isSlotAvailable) return;

      availableSlotInNextWeek.push(slot);
    }));

    return availableSlotInNextWeek;
  }
);

module.exports = availableSlots;
