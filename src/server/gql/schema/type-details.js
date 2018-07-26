const TypeDetails = `
  type ImportFull {
    containerId: String!
    formNumber705: String!
    containerSize: String!
    block: String!
  }

  type ImportEmpty {
    containerSize: ContainerSize!
    emptyForCityFormNum: String!
  }

  type ExportFull {
    containerId: String!
    containerSize: ContainerSize!
    containerWeight: Int! # might be float
    bookingNum: Int!
    vesselName: String!
    vesselETA: String!
    destinationPort: String!
    firstPortOfDischarge: String!
  }

  type ExportEmpty {
    containerId: String!
    containerSize: ContainerSize!
  }

  union TypeDetails = ImportFull | ImportEmpty | ExportFull | ExportEmpty
`;

module.exports = TypeDetails;
