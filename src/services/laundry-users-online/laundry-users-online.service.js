// Initializes the `laundry-users-online` service on path `/laundry-users-online`
const { LaundryUsersOnline } = require('./laundry-users-online.class');
const createModel = require('../../models/laundry-users-online.model');
const hooks = require('./laundry-users-online.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/laundry-users-online', new LaundryUsersOnline(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('laundry-users-online');

  service.hooks(hooks);
};
