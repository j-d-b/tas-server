const Query = `
  input ApptsWhere {
    userEmail: String
    timeSlot: TimeSlotInput
    blockID: String
    type: ApptType
  }

  input UsersWhere {
    email: String
    name: String
    role: UserRole
    company: String
    companyType: String
    companyRegNumber: String
    confirmed: Boolean
    emailVerified: Boolean
  }

  input AvailableSlotsInput {
    importFullContainerIds: [String]!
    knownContainerSizes: [ContainerSize]! # exports or import empty
  }

  input RestrictionsInput {
    timeSlotHours: [Hour!]
    timeSlotDates: [ISODate!]
    type: RestrictionType # null for 'both'
    blocks: [String!]
  }

  type Query {
    myAppts: [Appt]
    appt(id: ID!): Appt
    appts(where: ApptsWhere): [Appt]

    me: User
    user(email: String!): User
    users(where: UsersWhere): [User]

    allBlocks: [Block]
    block(id: String!): Block

    availableSlots(input: AvailableSlotsInput!): [TimeSlot]

    restrictions(input: RestrictionsInput!): [Restriction]
    defaultAllowedApptsPerHour: Int
    arrivalWindowLength: Int
  }
`;

module.exports = Query;