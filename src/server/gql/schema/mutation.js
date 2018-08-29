const Mutation = `
  input AddApptInput {
    timeSlot: TimeSlotInput!
    userEmail: String!
    type: ApptType!
    licensePlateNumber: String
    notifyMobileNumber: String
    importFull: AddImportFullInput
    importEmpty: AddImportEmptyInput
    exportFull: AddExportFullInput
    exportEmpty: AddExportEmptyInput
  }

  input UpdateApptInput {
    timeSlot: TimeSlotInput
    userEmail: String
    importFull: UpdateImportFullInput
    importEmpty: UpdateImportEmptyInput
    exportFull: UpdateExportFullInput
    exportEmpty: UpdateExportEmptyInput
  }

  input AddImportFullInput {
    containerId: String!
    formNum705: String!
  }

  input UpdateImportFullInput {
    formNum705: String
  }

  input AddImportEmptyInput {
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
    emptyForCityFormNum: String!
  }

  input UpdateImportEmptyInput {
    emptyForCityFormNum: String
    shippingLine: String
  }

  input AddExportFullInput {
    containerId: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    containerType: String!
    shippingLine: String!
    bookingNum: Int!
    vesselName: String!
    vesselETA: String!
  }

  input UpdateExportFullInput {
    bookingNum: Int
    vesselName: String
    vesselETA: String
    shippingLine: String
  }

  input AddExportEmptyInput {
    containerId: String!
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
  }

  input UpdateExportEmptyInput {
    shippingLine: String
  }

  input AddUserInput {
    email: String!
    name: String!
    company: String!
    mobileNumber: String
    companyType: String
    companyRegNum: String
  }

  input UpdateUserInput {
    name: String
    role: UserRole
    company: String
    mobileNumber: String
    companyType: String
    companyRegNum: String
    reminderSetting: ReminderSetting
  }

  input AddBlockInput {
    blockId: String!
    maxAllowedApptsPerHour: Int!
  }

  input AddRestrictionInput {
    timeSlot: TimeSlotInput!
    allowedAppts: Int!
    block: String
  }

  input DeleteRestrictionInput {
    timeSlot: TimeSlotInput!
    block: String
  }

  type Mutation {
    addAppt(details: AddApptInput!): Appt
    addAppts(input: [AddApptInput!]!): [Appt]
    updateAppt(id: ID!, details: UpdateApptInput!): Appt
    deleteAppt(id: ID!): String

    addUser(password: String!, details: AddUserInput!): User
    updateUser(email: String!, details: UpdateUserInput!): User
    deleteUser(email: String!): String

    addBlock(details: AddBlockInput!): Block
    deleteBlock(id: String!): String
    updateBlockMaxAllowed(blockId: String!, newVal: Int!): Block

    login(email: String!, password: String!): String
    verifyEmail(verifyToken: String!): String
    confirmUser(email: String!): String
    changePass(currPassword: String!, newPassword: String!): String
    changeEmail(currEmail: String!, newEmail: String!): String
    resetPass(resetToken: String!, newPassword: String!): String
    sendResetPassLink(email: String!): String
    sendVerifyEmailLink(email: String!): String
    sendApptReminders: String

    addRestrictions(input: [AddRestrictionInput!]!): [Restriction!]
    deleteRestriction(input: DeleteRestrictionInput!): String
    updateTotalMaxAllowed(newVal: Int!): Int
  }
`;

module.exports = Mutation;
