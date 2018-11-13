const Query = `
  input ApptsWhere {
    userEmail: String
    timeSlot: TimeSlotInput
    blockId: String
    type: ApptType
  }

  input ApptsInput {
    where: ApptsWhere
  }

  input ApptInput {
    id: ID!
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

  input UserInput {
    email: String!
  }

  input UsersInput {
    where: UsersWhere
  }

  input BlockInput {
    id: String!
  }

  input AvailableSlotsInput {
    importFullContainerIds: [String]!
    knownContainerSizes: [ContainerSize]! # exports or storage empty
  }

  input RestrictionsInput {
    timeSlotHours: [Hour!]
    timeSlotDates: [ISODate!]
    type: RestrictionType # null for 'both'
    blocks: [String!]
  }

  type Query {
    myAppts: [Appt]
    appt(input: ApptInput!): Appt
    appts(input: ApptsInput!): [Appt]

    me: User
    user(input: UserInput!): User
    users(input: UsersInput!): [User]

    allBlocks: [Block]
    block(input: BlockInput!): Block

    availableSlots(input: AvailableSlotsInput!): [TimeSlot]

    restrictions(input: RestrictionsInput!): [Restriction]
    defaultAllowedApptsPerHour: Int
    arrivalWindowLength: Int
  }
`;

module.exports = Query;
