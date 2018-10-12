module.exports = `
  # TODO consider deleting by ID only
  input DeleteRestrictionInput {
    timeSlot: TimeSlotInput!
    type: RestrictionType!
    blockID: String
  }
`;
