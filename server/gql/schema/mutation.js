const Mutation = `
  input AddUserInput {
    email: String!
    name: String!
    company: String!
    mobileNumber: String
  }

  input UpdateUserInput {
    name: String
    role: UserRole
    company: String
    mobileNumber: String
  }

  input AddImportFullInput {
    containerID: String!
    formNumber705: String!
  }

  input AddImportEmptyInput {
    containerSize: ContainerSize!
    emptyForCityFormNum: String!
  }

  input AddExportFullInput {
    containerID: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    bookingNum: Int!
    vesselName: String!
    vesselETA: String!
    destinationPort: String!
    firstPortOfDischarge: String!
  }

  input AddExportEmptyInput {
    containerID: String!
    containerSize: ContainerSize!
  }

  input UpdateImportFullInput {
    containerID: String
    formNumber705: String
  }

  input UpdateImportEmptyInput {
    containerSize: ContainerSize
    emptyForCityFormNum: String
  }

  input UpdateExportFullInput {
    containerID: String
    containerSize: ContainerSize
    containerWeight: Int # might be float
    bookingNum: Int
    vesselName: String
    vesselETA: String
    destinationPort: String
    firstPortOfDischarge: String
  }

  input UpdateExportEmptyInput {
    containerID: String
    containerSize: ContainerSize
  }

  input TimeSlotInput {
    hour: Hour!
    date: ISODate!
  }

  input AddApptInput {
    timeSlot: TimeSlotInput!
    block: String!
    userEmail: String!
    type: ApptType!
    importFull: AddImportFullInput
    importEmpty: AddImportEmptyInput
    exportFull: AddExportFullInput
    exportEmpty: AddExportEmptyInput
  }

  input UpdateApptInput {
    timeSlot: TimeSlotInput
    block: String
    userEmail: String
    type: ApptType
    importFull: UpdateImportFullInput
    importEmpty: UpdateImportEmptyInput
    exportFull: UpdateExportFullInput
    exportEmpty: UpdateExportEmptyInput
  }

  input AddBlockInput {
    blockId: String!
    currAllowedApptsPerHour: Int!
    maxAllowedApptsPerHour: Int!
  }

  type Mutation {
    addAppt(details: AddApptInput!): Appt
    updateAppt(id: ID!, details: UpdateApptInput!): Appt
    deleteAppt(id: ID!): String

    addUser(password: String!, details: AddUserInput!): User
    updateUser(email: String!, details: UpdateUserInput!): User
    deleteUser(email: String!): String

    addBlock(details: AddBlockInput!): Block
    deleteBlock(id: String!): String
    updateBlockMaxAllowed(blockId: String!, newVal: Int!): Block
    updateBlockCurrAllowed(blockId: String!, newVal: Int!): Block

    login(email: String!, password: String!): String
    verifyEmail(verifyToken: String!): String
    confirmUser(email: String!): String
    changePass(currPassword: String!, newPassword: String!): String
    changeEmail(currEmail: String!, newEmail: String!): String
    resetPass(resetToken: String!, newPassword: String!): String
    sendResetPassLink(email: String!): String
    sendVerifyEmailLink(email: String!): String

    updateTotalAllowed(newVal: Int!): Int
  }
`;

module.exports = Mutation;
