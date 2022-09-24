// Initializes the `laundry-sessions` service on path `/laundry-sessions`
const { LaundrySessions } = require('./laundry-sessions.class');
const createModel = require('../../models/laundry-sessions.model');
const hooks = require('./laundry-sessions.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    mult: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/laundry-sessions', new LaundrySessions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('laundry-sessions');

  service.hooks(hooks);
};
