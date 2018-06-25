// this file is for actions, like sending password and such
// think about renaming

login(email: String!, password: String!): String
changePassword(email: String, newPassword: String!, currPassword: String): String
resetPassword(token: String!, newPassword: String!): String
sendResetPassLink(email: String!): String
