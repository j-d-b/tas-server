const TypeDetails = `
  type ImportFull {
    containerID: String!
    formNumber705: String!
    containerSize: String!
    containerType: String!
  }

  type ImportEmpty {
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
    emptyForCityFormNumber: String!
  }

  type ExportFull {
    containerID: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    containerType: String!
    shippingLine: String!
    bookingNumber: Int!
    vesselName: String!
    vesselETA: String!
  }

  type ExportEmpty {
    containerID: String!
    containerSize: ContainerSize!
    containerType: String!
    shippingLine: String!
  }

  union TypeDetails = ImportFull | ImportEmpty | ExportFull | ExportEmpty
`;

module.exports = TypeDetails;
