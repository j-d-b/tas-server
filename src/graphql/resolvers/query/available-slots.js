const { isAuthenticatedResolver } = require('../auth');
const { isValidNumContainersCheck, doContainerIdsExistCheck } = require('../checks');
const { getTimeSlotsInNextWeek, slotTotalAvailability, slotBlockAvailability } = require('../helpers');

// availableSlots(input: AvailableSlotsInput!): [TimeSlot]
const availableSlots = isAuthenticatedResolver.createResolver(
  async (_, { input: { importFullContainerIds, knownContainerSizes }}, { Appt, Block, Config, Restriction }) => {
    const importFullBlockAndSize = doContainerIdsExistCheck(importFullContainerIds);

    const containerSizes = knownContainerSizes.concat(importFullBlockAndSize.map(({ containerSize }) => containerSize));
    await isValidNumContainersCheck(containerSizes, Config);

    const moveCountByBlock = importFullBlockAndSize.reduce((acc, { blockID }) => {
      acc[blockID] ? acc[blockID]++ : acc[blockID] = 1;
      return acc;
    }, {});

    const availableSlotInNextWeek = [];

    await Promise.all(getTimeSlotsInNextWeek().map(async (slot) => {
      const isSlotAvailable = await slotTotalAvailability(slot, containerSizes.length, Appt, Config, Restriction);
      if (!isSlotAvailable) return;

      const isSlotBlockAvailable = await slotBlockAvailability(slot, moveCountByBlock, Appt, Block, Restriction);
      if (!isSlotBlockAvailable) return;

      availableSlotInNextWeek.push(slot);
    }));

    return availableSlotInNextWeek;
  }
);

module.exports = availableSlots;
