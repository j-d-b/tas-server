const TimeSlotInput = require('./time-slot-input');
const AddApptInput = require('./add-appt-input');
const AddGlobalRestrictionInput = require('./add-global-restriction-input');
const AddTemplateRestrictionInput = require('./add-template-restriction-input');
const AddRestrictionTemplateInput = require('./add-restriction-template-input');
const AddUserInput = require('./add-user-input');
const ChangeUserEmailInput = require('./change-user-email-input');
const ChangePasswordInput = require('./change-password-input');
const ConfirmUserInput = require('./confirm-user-input');
const DeleteApptInput = require('./delete-appt-input');
const DeleteRestrictionInput = require('./delete-restriction-input');
const DeleteRestrictionTemplateInput = require('./delete-restriction-template-input');
const DeleteUserInput = require('./delete-user-input');
const LoginInput = require('./login-input');
const LogoutInput = require('./logout-input');
const RescheduleApptInput = require('./reschedule-appt-input');
const ResetPasswordInput = require('./reset-password-input');
const SendApptRemindersInput = require('./send-appt-reminders-input');
const SendResetPasswordLinkInput = require('./send-reset-password-link-input');
const SendVerifyEmailLinkInput = require('./send-verify-email-link-input');
const SetAppliedRestrictionTemplateInput = require('./set-applied-restriction-template-input');
const UpdateApptDetailsInput = require('./update-appt-details-input');
const UpdateArrivalWindowLengthInput = require('./update-arrival-window-length-input');
const UpdateDefaultAllowedInput = require('./update-default-allowed-input');
const UpdateRestrictionTemplateInput = require('./update-restriction-template-input');
const UpdateUserInput = require('./update-user-input');
const VerifyEmailInput = require('./verify-email-input');

module.exports = [
  AddApptInput,
  AddGlobalRestrictionInput,
  AddTemplateRestrictionInput,
  AddRestrictionTemplateInput,
  AddUserInput,
  ChangeUserEmailInput,
  ChangePasswordInput,
  ConfirmUserInput,
  DeleteApptInput,
  DeleteRestrictionInput,
  DeleteRestrictionTemplateInput,
  DeleteUserInput,
  LoginInput,
  LogoutInput,
  RescheduleApptInput,
  ResetPasswordInput,
  SendApptRemindersInput,
  SendResetPasswordLinkInput,
  SendVerifyEmailLinkInput,
  SetAppliedRestrictionTemplateInput,
  TimeSlotInput,
  UpdateApptDetailsInput,
  UpdateArrivalWindowLengthInput,
  UpdateDefaultAllowedInput,
  UpdateRestrictionTemplateInput,
  UpdateUserInput,
  VerifyEmailInput
];
