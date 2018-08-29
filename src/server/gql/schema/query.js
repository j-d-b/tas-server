const Query = `
  input TimeSlotInput {
    hour: Hour!
    date: ISODate!
  }

  input ApptsWhere {
    userEmail: String
    timeSlot: TimeSlotInput
    block: String
    type: ApptType
  }

  input UsersWhere {
    email: String
    name: String
    role: UserRole
    company: String
    companyType: String
    companyRegNum: String
    confirmed: Boolean
    emailVerified: Boolean
  }

  input AvailableSlotsInput {
    numContainers: Int!
    importFullContainerIds: [String]
    knownContainerSizes: [ContainerSize] # exports or import empty
  }

  input RestrictionsInput {
    timeSlotHours: [Hour!]
    timeSlotDates: [ISODate!]
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
    maxAllowedApptsPerHour: Int
  }
`;

module.exports = Query;
