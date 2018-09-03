const Sequelize = require('sequelize');

module.exports = sequelize.define('appt', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  timeSlotHour: {
    type: Sequelize.INTEGER,
    field: 'time_slot_hour',
    allowNull: false
  },
  timeSlotDate: {
    type: Sequelize.DATEONLY,
    field: 'time_slot_date',
    allowNull: false
  },
  type: {
    type: Sequelize.ENUM,
    values: ['IMPORTFULL', 'IMPORTEMPTY', 'EXPORTFULL', 'EXPORTEMPTY'],
    allowNull: false
  },
  notifyMobileNumber: {
    type: Sequelize.STRING,
    field: 'notify_mobile_number'
  },
  licensePlateNumber: {
    type: Sequelize.STRING,
    field: 'license_plate_number'
  }, // type specific details below
  containerId: {
    type: Sequelize.STRING,
    field: 'container_id'
  },
  containerSize: {
    type: Sequelize.ENUM,
    values: ['TWENTYFOOT', 'FORTYFOOT'],
    field: 'container_size'
  },
  containerWeight: {
    type: Sequelize.INTEGER,
    field: 'container_weight'
  },
  containerType: {
    type: Sequelize.STRING,
    field: 'container_type'
  },
  block: Sequelize.STRING,
  formNum705: {
    type: Sequelize.STRING,
    field: 'form_num_705'
  },
  emptyForCityFormNum: {
    type: Sequelize.STRING,
    field: 'empty_for_city_form_num'
  },
  bookingNum: {
    type: Sequelize.STRING,
    field: 'booking_num'
  },
  vesselName: {
    type: Sequelize.STRING,
    field: 'vessel_name'
  },
  vesselETA: {
    type: Sequelize.DATE,
    field: 'vessel_eta'
  },
  shippingLine: {
    type: Sequelize.STRING,
    field: 'shipping_line'
  }
},
{
  getterMethods: {
    timeSlot: function() {
      return { hour: this.timeSlotHour, date: this.timeSlotDate };
    },
    typeDetails: function() {
      return {
        containerId: this.containerId,
        containerSize: this.containerSize,
        containerWeight: this.containerWeight,
        containerType: this.containerType,
        block: this.block,
        formNum705: this.formNum705,
        emptyForCityFormNum: this.emptyForCityFormNum,
        bookingNum: this.bookingNum,
        vesselName: this.vesselName,
        vesselETA: this.vesselETA,
        shippingLine: this.shippingLine
      };
    }
  },
  setterMethods: {
    timeSlot: function(slot) {
      this.setDataValue('timeSlotHour', slot.hour);
      this.setDataValue('timeSlotDate', slot.date);
    },
    typeDetails: function(details) {
      details.containerId && this.setDataValue('containerId', details.containerId);
      details.containerSize && this.setDataValue('containerSize', details.containerSize);
      details.containerWeight && this.setDataValue('containerWeight', details.containerWeight);
      details.containerType && this.setDataValue('containerType', details.containerType);
      details.block && this.setDataValue('block', details.block);
      details.formNum705 && this.setDataValue('formNumber705', details.formNum705);
      details.emptyForCityFormNum && this.setDataValue('emptyForCityFormNum', details.emptyForCityFormNum);
      details.bookingNum && this.setDataValue('bookingNum', details.bookingNum);
      details.vesselName && this.setDataValue('vesselName', details.vesselName);
      details.vesselETA && this.setDataValue('vesselETA', details.vesselETA);
      details.shippingLine && this.setDataValue('shippingLine', details.shippingLine);
    }
  },
  underscored: true
});
