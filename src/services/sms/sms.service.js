// Initializes the `sms` service on path `/sms`
const { Sms } = require('./sms.class');
const createModel = require('../../models/sms.model');
const hooks = require('./sms.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['remove', 'patch']
  };

  // Initialize our service with any options it requires
  app.use('/sms', new Sms(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sms');

  service.hooks(hooks);
};
