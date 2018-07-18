const Appt = `
  type Appt {
    id: ID!
    timeSlot: TimeSlot!
    user: User!
    type: ApptType!
    typeDetails: TypeDetails!
  }
`;

module.exports = Appt;
