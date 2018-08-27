const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const AllowedAppts = sequelize.define('allowed_appts', {
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
    block: {
      type: Sequelize.STRING
    },
    allowedAppts: {
      type: Sequelize.INTEGER,
      field: 'allowed_appts',
      allowNull: false
    },
    total: Sequelize.BOOLEAN // is it block/hr or total/hr
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
      },
    },
    underscored: true,
    freezeTableName: true
  });

  const Appt = sequelize.define('appt', {
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
    block: Sequelize.STRING,
    formNumber705: {
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
    destinationPort: {
      type: Sequelize.STRING,
      field: 'desintation_port'
    },
    firstPortOfDischarge: {
      type: Sequelize.STRING,
      field: 'first_port_of_discharge'
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
          block: this.block,
          formNumber705: this.formNumber705,
          emptyForCityFormNum: this.emptyForCityFormNum,
          bookingNum: this.bookingNum,
          vesselName: this.vesselName,
          vesselETA: this.vesselETA,
          destinationPort: this.destinationPort,
          firstPortOfDischarge: this.firstPortOfDischarge
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
        details.block && this.setDataValue('block', details.block);
        details.formNumber705 && this.setDataValue('formNumber705', details.formNumber705);
        details.emptyForCityFormNum && this.setDataValue('emptyForCityFormNum', details.emptyForCityFormNum);
        details.bookingNum && this.setDataValue('bookingNum', details.bookingNum);
        details.vesselName && this.setDataValue('vesselName', details.vesselName);
        details.vesselETA && this.setDataValue('vesselETA', details.vesselETA);
        details.destinationPort && this.setDataValue('destinationPort', details.destinationPort);
        details.firstPortOfDischarge && this.setDataValue('firstPortOfDischarge', details.firstPortOfDischarge);
      }
    },
    underscored: true
  });

  const Block = sequelize.define('block', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    maxAllowedApptsPerHour: {
      type: Sequelize.INTEGER,
      field: 'max_allowed_appts_per_hour',
      allowNull: false
    }
  });

  // single row config table
  const Config = sequelize.define('config', {
    maxAllowedApptsPerHour: {
      type: Sequelize.INTEGER,
      field: 'max_allowed_appts_per_hour',
      allowNull: false
    },
    maxTFUPerAppt: {
      type: Sequelize.INTEGER,
      field: 'max_tfu_per_appt',
      allowNull: false
    }
  }, { timestamps: false, freezeTableName: true, underscored: true });

  const ContainerMap = sequelize.define('container_map', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    targetBlock: {
      type: Sequelize.STRING,
      field: 'target_block',
      allowNull: false
    },
    apptType: {
      type: Sequelize.ENUM,
      values: ['EXPORTEMPTY', 'EXPORTFULL'],
      field: 'appt_type',
      allowNull: false
    },
    containerSize: {
      type: Sequelize.ENUM,
      values: ['TWENTYFOOT', 'FORTYFOOT'],
      field: 'container_size'
    },
    containerType: {
      type: Sequelize.STRING,
      field: 'container_type'
    },
    shippingLine: {
      type: Sequelize.STRING,
      field: 'shipping_line'
    },
    vesselName: {
      type: Sequelize.STRING,
      field: 'vessel_name',
    }
  }, { underscored: true });

  const User = sequelize.define('user', {
    email: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM,
      values: ['CUSTOMER', 'OPERATOR', 'ADMIN'],
      defaultValue: 'CUSTOMER',
      allowNull: false
    },
    confirmed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email_verified'
    },
    company: {
      type: Sequelize.STRING,
      allowNull: false
    },
    mobileNumber: {
      type: Sequelize.STRING,
      field: 'mobile_number'
    },
    companyType: {
      type: Sequelize.STRING,
      field: 'company_type'
    },
    companyRegNum: {
      type: Sequelize.STRING,
      field: 'company_reg_num'
    }
  }, { underscored: true });

  // associations
  Block.hasMany(Appt, { foreignKey: 'block' });
  Block.hasMany(AllowedAppts, { foreignKey: 'block' });
  User.hasMany(Appt, { foreignKey: 'userEmail' });

  return {
    AllowedAppts,
    Appt,
    Block,
    Config,
    ContainerMap,
    User
  };
};
