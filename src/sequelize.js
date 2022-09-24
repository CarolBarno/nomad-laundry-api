/* eslint-disable linebreak-style */
const Sequelize = require('sequelize');

module.exports = function (app) {
  const connectionString = app.get('mysql');
  const sequelize = new Sequelize(connectionString.database, connectionString.username, connectionString.password, {
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 30000,
      acquire: 100000
    },
    define: {
      freezeTableName: true
    },
    timezone: '+03:00'
  });
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    app.set('sequelizeSync', sequelize.sync());

    return result;
  };
};
