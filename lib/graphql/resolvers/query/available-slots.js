const { isAuthenticatedResolver } = require('../auth');
const { isValidNumContainersCheck } = require('../checks');
const { getTimeSlotsInNextWeek, slotTotalAvailability } = require('../helpers');

// availableSlots(input: AvailableSlotsInput!): [TimeSlot]
const availableSlots = isAuthenticatedResolver.createResolver(
  async (_, { input: { importFullContainerIds, knownContainerSizes } }, { Appt, Config, Restriction }) => {
    const importFullSizes = ['TWENTY_FOOT']; // TODO

    const containerSizes = knownContainerSizes.concat(importFullSizes);
    await isValidNumContainersCheck(containerSizes, Config);

    const availableSlotInNextWeek = [];

    await Promise.all(getTimeSlotsInNextWeek().map(async (slot) => {
      const isSlotAvailable = await slotTotalAvailability(slot, containerSizes.length, Appt, Config, Restriction);
      if (!isSlotAvailable) return;

      availableSlotInNextWeek.push(slot);
    }));

    return availableSlotInNextWeek;
  }
);

module.exports = availableSlots;
