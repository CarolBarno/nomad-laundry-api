// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('laundry_users', {

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    user_status: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'I',
      comment: 'A - Active, I - Inactive, B - Blacklisted, D - Deleted'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verifyToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verifyExpires: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verifyChanges: {
      type: DataTypes.JSON,
      allowNull: true
    },
    password_expiry: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => {
        let date = new Date();
        let currentMonth = date.getMonth();
        date.setMonth(currentMonth + 3);
        return date;
      }
    },
    user_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '0 - backend, 1 - frontend'
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  users.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return users;
};
