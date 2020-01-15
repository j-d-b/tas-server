module.exports = `
  input AddImportFullInput {
    containerId: String!
    formNumber705: String!
    containerType: ContainerType!
    containerSize: ContainerSize!
  }

  input AddStorageEmptyInput {
    containerSize: ContainerSize!
    containerType: ContainerType!
    emptyForCityFormNumber: String!
  }

  input AddExportFullInput {
    containerId: String!
    containerSize: ContainerSize!
    containerWeight: Float!
    containerType: ContainerType!
    shippingLine: String!
    bookingNumber: String!
  }

  input AddExportEmptyInput {
    containerId: String!
    containerSize: ContainerSize!
    containerType: ContainerType!
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
