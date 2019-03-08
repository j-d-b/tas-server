const Sequelize = require('sequelize');

module.exports = sequelize => (
  sequelize.define('restriction', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    timeSlotHour: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    timeSlotDate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM,
      values: ['GATE_CAPACITY', 'PLANNED_ACTIVITIES'],
      allowNull: false
    },
    gateCapacity: Sequelize.INTEGER,
    plannedActivities: Sequelize.INTEGER
  },
  {
    getterMethods: {
      timeSlot: function() {
        return { hour: this.timeSlotHour, date: this.timeSlotDate };
      }
    },
    setterMethods: {
      timeSlot: function(slot) {
        this.setDataValue('timeSlotHour', slot.hour);
        this.setDataValue('timeSlotDate', slot.date);
      }
    }
  })
);
