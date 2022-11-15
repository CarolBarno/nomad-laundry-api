// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const laundrySiteSettings = sequelizeClient.define('laundry_site_settings', {
    site_name: {
      type: DataTypes.STRING,
      allowNull: true    
    },
    is_host: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    site_description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: true
    },
    site_logo: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    terms_conditions: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact_phone: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    payment_deadline: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    //smtp settings
    smtp_host: {
      type: DataTypes.STRING,
      allowNull: true
    },
    smtp_port: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    smtp_username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    smtp_password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    layer_security: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password_expiry_period: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    vat_percentage: {
      type: DataTypes.DOUBLE(5, 2),
      allowNull: false,
      defaultValue: 16
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  laundrySiteSettings.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return laundrySiteSettings;
};
