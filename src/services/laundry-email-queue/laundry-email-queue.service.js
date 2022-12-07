// Initializes the `laundry-email-queue` service on path `/laundry-email-queue`
const { LaundryEmailQueue } = require('./laundry-email-queue.class');
const createModel = require('../../models/laundry-email-queue.model');
const hooks = require('./laundry-email-queue.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['remove', 'patch']
  };

  // Initialize our service with any options it requires
  app.use('/laundry-email-queue', new LaundryEmailQueue(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('laundry-email-queue');

  service.hooks(hooks);
};
