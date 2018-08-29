const Appt = `
  type Appt {
    id: ID!
    timeSlot: TimeSlot!
    user: User!
    type: ApptType!
    licensePlateNumber: String!
    notifyMobileNumber: String!
    typeDetails: TypeDetails!
  }
`;

module.exports = Appt;
