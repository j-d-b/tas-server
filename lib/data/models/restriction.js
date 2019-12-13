const Sequelize = require('sequelize');
const { format } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const moment = require('moment-timezone');

const sequelize = require('../sequelize');
const { TIMEZONE } = process.env;

const Restriction = sequelize.define('restriction', {
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
  timeSlotDateUTC: Sequelize.DATE,
  hour: Sequelize.INTEGER,
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
      const zonedTime = utcToZonedTime(this.timeSlotDateUTC, TIMEZONE);
      return {
        hour: Number(format(zonedTime, 'HH')),
        date: format(zonedTime, 'yyyy-MM-dd')
      };
    }
  },
  setterMethods: {
    timeSlot: function(slot) {
      const getHourString = hourVal => hourVal < 10 ? `0${hourVal}:00` : `${hourVal}:00`;
      const utcTime = moment.tz(`${slot.date} ${getHourString(slot.hour)}:00`, TIMEZONE);
      this.setDataValue('timeSlotDateUTC', utcTime);
    }
  },
  timestamps: false
});

module.exports = Restriction;
