const TimeSlotInput = require('./time-slot-input');
const AddApptInput = require('./add-appt-input');
const AddBlockInput = require('./add-block-input.js');
const AddExportEmptyInput = require('./add-export-empty-input');
const AddExportFullInput = require('./add-export-full-input');
const AddImportEmptyInput = require('./add-import-empty-input');
const AddImportFullInput = require('./add-import-full-input');
const AddRestrictionInput = require('./add-restriction-input');
const AddUserInput = require('./add-user-input');
const ChangeUserEmailInput = require('./change-user-email-input');
const ChangePasswordInput = require('./change-password-input');
const ConfirmUserInput = require('./confirm-user-input');
const DeleteApptInput = require('./delete-appt-input');
const DeleteBlockInput = require('./delete-block-input');
const DeleteRestrictionInput = require('./delete-restriction-input');
const DeleteUserInput = require('./delete-user-input');
const LoginInput = require('./login-input');
const RescheduleApptInput = require('./reschedule-appt-input');
const ResetPasswordInput = require('./reset-password-input');
const SendApptRemindersInput = require('./send-appt-reminders-input');
const SendResetPasswordLinkInput = require('./send-reset-password-link-input');
const SendVerifyEmailLinkInput = require('./send-verify-email-link-input');
const UpdateApptDetailsInput = require('./update-appt-details-input');
const UpdateArrivalWindowLengthInput = require('./update-arrival-window-length-input');
const UpdateBlockMaxAllowedInput = require('./update-block-max-allowed-input');
const UpdateDefaultAllowedInput = require('./update-default-allowed-input');
const UpdateExportEmptyInput = require('./update-export-empty-input');
const UpdateExportFullInput = require('./update-export-full-input');
const UpdateImportEmptyInput = require('./update-import-empty-input');
const UpdateImportFullInput = require('./update-import-full-input');
const UpdateUserInput = require('./update-user-input');
const VerifyEmailInput = require('./verify-email-input');

module.exports = [
  AddApptInput,
  AddBlockInput,
  AddExportEmptyInput,
  AddExportFullInput,
  AddImportEmptyInput,
  AddImportFullInput,
  AddRestrictionInput,
  AddUserInput,
  ChangeUserEmailInput,
  ChangePasswordInput,
  ConfirmUserInput,
  DeleteApptInput,
  DeleteBlockInput,
  DeleteRestrictionInput,
  DeleteUserInput,
  LoginInput,
  RescheduleApptInput,
  ResetPasswordInput,
  SendApptRemindersInput,
  SendResetPasswordLinkInput,
  SendVerifyEmailLinkInput,
  TimeSlotInput,
  UpdateApptDetailsInput,
  UpdateArrivalWindowLengthInput,
  UpdateBlockMaxAllowedInput,
  UpdateDefaultAllowedInput,
  UpdateExportEmptyInput,
  UpdateExportFullInput,
  UpdateImportEmptyInput,
  UpdateImportFullInput,
  UpdateUserInput,
  VerifyEmailInput
];
