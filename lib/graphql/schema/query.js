const Query = `
  input ApptsWhere {
    userEmail: String
    actionType: ActionType
  }

  input ApptsInput {
    startDate: ISODate
    endDate: ISODate
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

  input AvailableSlotsInput {
    containerSizes: [ContainerSize]!
  }

  input GlobalRestrictionsWhere {
    timeSlotHours: [Hour!]
    timeSlotDates: [ISODate!]
  }

  input GlobalRestrictionsInput {
    startDate: ISODate
    endDate: ISODate
  }

  input RestrictionTemplatesInput {
    name: String
  }

  input AppliedRestrictionTemplateInput {
    unused: String
  }

  type Query {
    myAppts: [Appt]
    appt(input: ApptInput!): Appt
    appts(input: ApptsInput!): [Appt]

    me: User
    user(input: UserInput!): User
    users(input: UsersInput!): [User]

    availableSlots(input: AvailableSlotsInput!): [TimeSlot]

    globalRestrictions(input: GlobalRestrictionsInput!): [Restriction]
    restrictionTemplates(input: RestrictionTemplatesInput!): [RestrictionTemplate]
    appliedRestrictionTemplate(input: AppliedRestrictionTemplateInput!): RestrictionTemplate

    defaultAllowedApptsPerHour: Int
    arrivalWindowLength: Int
  }
`;

module.exports = Query;
