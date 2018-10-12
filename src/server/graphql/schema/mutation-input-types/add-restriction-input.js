module.exports = `
  input AddRestrictionInput {
    timeSlot: TimeSlotInput!
    type: RestrictionType!
    blockId: String
    gateCapacity: Int
    plannedActivities: Int
  }
`;
