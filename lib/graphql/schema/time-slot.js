const TimeSlot = `
  type TimeSlot {
    hour: Hour! # 0-23
    date: ISODate! # yyyy-MM-dd
  }
`;

module.exports = TimeSlot;
