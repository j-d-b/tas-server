const Appt = `
  type Appt {
    id: ID!
    timeSlot: TimeSlot!
    user: User!
    type: ApptType!
    block: Block
    arrivalWindow: String!
    licensePlateNumber: String!
    notifyMobileNumber: String!
    typeDetails: TypeDetails!
  }
`;

module.exports = Appt;
