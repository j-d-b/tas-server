const Mutation = `
  type Mutation {
    addAppt(input: AddApptInput!): Appt
    addAppts(input: [AddApptInput!]!): [Appt]
    updateAppt(input: UpdateApptInput!): Appt
    deleteAppt(input: DeleteApptInput!): String

    addUser(input: AddUserInput!): User
    updateUser(input: UpdateUserInput!): User
    deleteUser(input: DeleteUserInput!): String

    addBlock(input: AddBlockInput!): Block
    deleteBlock(input: DeleteBlockInput!): String
    updateBlockMaxAllowed(input: UpdateBlockMaxAllowedInput!): Block

    login(input: LoginInput!): String
    verifyEmail(input: VerifyEmailInput!): String
    confirmUser(input: ConfirmUserInput!): String
    changePassword(input: ChangePasswordInput!): String
    changeEmail(input: ChangeEmailInput!): String
    resetPassword(input: ResetPasswordInput!): String
    sendResetPasswordLink(input: SendResetPasswordLinkInput!): String
    sendVerifyEmailLink(input: SendVerifyEmailLinkInput!): String
    sendApptReminders(input: SendApptRemindersInput!): String

    addRestrictions(input: [AddRestrictionInput!]!): [Restriction!]
    deleteRestriction(input: DeleteRestrictionInput!): String
    updateDefaultAllowed(input: UpdateDefaultAllowedInput!): Int
    updateArrivalWindowLength(input: UpdateArrivalWindowLengthInput!): Int
  }
`;

module.exports = Mutation;