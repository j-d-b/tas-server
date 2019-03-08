const Sequelize = require('sequelize');
const nanoid = require('nanoid');

module.exports = sequelize => (
  sequelize.define('appt', {
    id: {
      type: Sequelize.UUID,
      defaultValue: nanoid,
      primaryKey: true
    },
    timeSlotHour: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    timeSlotDate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    arrivalWindowSlot: {
      type: Sequelize.INTEGER, // 0 to (60 / arrivalWindowLength)
      allowNull: false
    },
    arrivalWindowLength: {
      type: Sequelize.INTEGER, // when the appt was booked
      allowNull: false
    },
    notifyMobileNumber: Sequelize.STRING,
    licensePlateNumber: Sequelize.STRING,
    comment: Sequelize.STRING
  },
  {
    getterMethods: {
      timeSlot: function() {
        return { hour: this.timeSlotHour, date: this.timeSlotDate };
      },
      arrivalWindow: function() {
        const startHour = this.timeSlotHour < 10 ? `0${this.timeSlotHour}` : this.timeSlotHour;
        let endHour = startHour;

        let startMinutes = this.arrivalWindowSlot * this.arrivalWindowLength;
        if (startMinutes < 10) startMinutes = '0' + startMinutes;

        let endMinutes = (this.arrivalWindowSlot + 1) * this.arrivalWindowLength;
        if (endMinutes < 10) endMinutes = '0' + endMinutes;
        else if (endMinutes === 60) {
          endMinutes = '00';
          endHour = new Date(Date.parse(`${this.timeSlotDate}T${startHour}:00:00Z`));
          endHour.setTime(endHour.getTime() + (60 * 60 * 1000));
          endHour = endHour.toISOString().split('T')[1].substring(0, 2);
        }

        return `${startHour}:${startMinutes} - ${endHour}:${endMinutes}`;
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
