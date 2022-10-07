// Initializes the `server-current-time` service on path `/server-current-time`
const { ServerCurrentTime } = require('./server-current-time.class');
const hooks = require('./server-current-time.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/server-current-time', new ServerCurrentTime(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('server-current-time');

  service.hooks(hooks);
};
