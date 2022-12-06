strict();
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable('laundry_users').then(attributes => {
      if (!attributes.id_number) {
        queryInterface.addColumn('laundry_users', 'id_number', {
          type: Sequelize.STRING(25),
          allowNull: true,
          unique: true,
          after: 'last_name'
        });
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.describeTable('laundry_users').then(attributes => {
      if (attributes.id_number) {
        queryInterface.removeColumn('laundry_users', 'id_number');
      }
    });
  }
};


function strict() {
  'use strict';
}
