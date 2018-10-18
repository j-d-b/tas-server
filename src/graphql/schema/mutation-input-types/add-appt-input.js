module.exports = `
  input AddImportFullInput {
    containerId: String!
    formNumber705: String!
  }

  input AddImportEmptyInput {
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
    emptyForCityFormNumber: String!
  }

  input AddExportFullInput {
    containerId: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    containerType: String!
    shippingLine: String!
    bookingNumber: Int!
    vesselName: String!
    vesselETA: String!
  }

  input AddExportEmptyInput {
    containerId: String!
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
  }

  input AddApptInput {
    timeSlot: TimeSlotInput!
    type: ApptType!
    licensePlateNumber: String
    notifyMobileNumber: String
    importFull: AddImportFullInput
    importEmpty: AddImportEmptyInput
    exportFull: AddExportFullInput
    exportEmpty: AddExportEmptyInput
  }
`;
