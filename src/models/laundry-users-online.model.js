// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const laundryUsersOnline = sequelizeClient.define('laundry_users_online', {
    session_expiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    session_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    access_token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  laundryUsersOnline.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    laundryUsersOnline.belongsTo(models.laundry_users, { as: 'user', foreignKey: 'user_id' });
  };

  return laundryUsersOnline;
};
