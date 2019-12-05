const Restriction = `
  type Restriction {
    id: ID!
    timeSlot: TimeSlot
    dayOfWeek: DayOfWeek
    hour: Int
    type: RestrictionType!
    gateCapacity: Int!
  }
`;

module.exports = Restriction;
