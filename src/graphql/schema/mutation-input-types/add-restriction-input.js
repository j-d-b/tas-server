module.exports = `
  input AddRestrictionInput {
    timeSlot: TimeSlotInput!
    type: RestrictionType!
    blockID: String
    gateCapacity: Int
    plannedActivities: Int
  }
`;
