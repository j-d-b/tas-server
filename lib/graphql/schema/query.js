const Query = `
  input ApptsWhere {
    userEmail: String
    actionType: ActionType
  }

  input ApptsInput {
    fromTimeSlot: TimeSlotInput
    toTimeSlot: TimeSlotInput
    where: ApptsWhere
  }

  input ApptInput {
    id: ID!
  }

  input UsersWhere {
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
    startTimeSlotDate: ISODate
    endTimeSlotDate: ISODate
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
    maxTFUPerAppt: Int
    systemTimezone: String
  }
`;

module.exports = Query;
