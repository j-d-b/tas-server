module.exports = `
  input AddImportFullInput {
    containerId: String!
    formNumber705: String!
  }

  input AddStorageEmptyInput {
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
    emptyForCityFormNumber: String!
  }

  input AddExportFullInput {
    containerId: String!
    containerSize: ContainerSize!
    containerWeight: Float!
    containerType: String!
    shippingLine: String!
    bookingNumber: String!
  }

  input AddExportEmptyInput {
    containerId: String!
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
  }

  input ActionInput {
    type: ActionType!
    importFull: AddImportFullInput
    storageEmpty: AddStorageEmptyInput
    exportFull: AddExportFullInput
    exportEmpty: AddExportEmptyInput
  }

  input AddApptInput {
    timeSlot: TimeSlotInput!
    licensePlateNumber: String
    notifyMobileNumber: String
    comment: String
    actions: [ActionInput!]!
  }
`;
