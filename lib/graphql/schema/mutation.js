const Mutation = `
  type Mutation {
    addAppt(input: AddApptInput!): Appt
    updateApptDetails(input: UpdateApptDetailsInput!): Appt
    rescheduleAppt(input: RescheduleApptInput!): Appt
    deleteAppt(input: DeleteApptInput!): String

    addUser(input: AddUserInput!): User
    updateUser(input: UpdateUserInput!): User
    deleteUser(input: DeleteUserInput!): String

    login(input: LoginInput!): String
    logout(input: LogoutInput!): String
    verifyEmail(input: VerifyEmailInput!): String
    confirmUser(input: ConfirmUserInput!): String
    changePassword(input: ChangePasswordInput!): String
    changeUserEmail(input: ChangeUserEmailInput!): String
    resetPassword(input: ResetPasswordInput!): String
    sendResetPasswordLink(input: SendResetPasswordLinkInput!): String
    sendVerifyEmailLink(input: SendVerifyEmailLinkInput!): String
    sendApptReminders(input: SendApptRemindersInput!): String

    addRestrictions(input: [AddRestrictionInput!]!): [Restriction!]
    deleteRestriction(input: DeleteRestrictionInput!): String
    addRestrictionTemplate(input: AddRestrictionTemplateInput!): RestrictionTemplate
    deleteRestrictionTemplate(input: DeleteRestrictionTemplateInput!): String
    
    updateDefaultAllowed(input: UpdateDefaultAllowedInput!): Int
    updateArrivalWindowLength(input: UpdateArrivalWindowLengthInput!): Int
  }
`;

module.exports = Mutation;
