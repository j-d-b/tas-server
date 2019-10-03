const Sequelize = require('sequelize');

module.exports = sequelize => (
  sequelize.define('restriction', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: Sequelize.ENUM,
      values: ['GLOBAL', 'TEMPLATE'],
      allowNull: false
    },
    hour: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    timeSlotDate: Sequelize.DATEONLY,
    dayOfWeek: {
      type: Sequelize.ENUM,
      values: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    },
    gateCapacity: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  {
    getterMethods: {
      timeSlot: function() {
        return { hour: this.hour, date: this.timeSlotDate };
      }
    },
    setterMethods: {
      timeSlot: function(slot) {
        this.setDataValue('hour', slot.hour);
        this.setDataValue('timeSlotDate', slot.date);
      }
    },
    timestamps: false
  })
);
