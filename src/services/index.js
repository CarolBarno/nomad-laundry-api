/* eslint-disable linebreak-style */
const users = require('./users/users.service.js');
const laundryUsersOnline = require('./laundry-users-online/laundry-users-online.service.js');
const laundrySessions = require('./laundry-sessions/laundry-sessions.service.js');
const serverCurrentTime = require('./server-current-time/server-current-time.service.js');
const otp = require('./otp/otp.service.js');

const laundrySiteSettings = require('./laundry-site-settings/laundry-site-settings.service.js');

module.exports = function (app) {
  app.configure(users);
  app.configure(laundryUsersOnline);
  app.configure(laundrySessions);
  app.configure(serverCurrentTime);
  app.configure(otp);
  app.configure(laundrySiteSettings);
};
