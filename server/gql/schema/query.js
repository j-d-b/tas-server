const Query = `
  input ApptsWhere {
    userEmail: String
    timeSlot: String
    block: String
    type: ApptType
  }

  input UsersWhere {
    email: String
    name: String
    role: UserRole
    company: String
    confirmed: Boolean
    emailVerified: Boolean
  }

  input AvailableSlotsInput {
    numContainers: Int!
    importFullContainerIDs: [String]
    knownContainerSizes: [ContainerSize] # exports or import empty
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
    totalAllowedApptsPerHour: Int
  }
`;

module.exports = Query;
