/* eslint-disable linebreak-style */
const users = require('./users/users.service.js');
const laundryUsersOnline = require('./laundry-users-online/laundry-users-online.service.js');
const laundrySessions = require('./laundry-sessions/laundry-sessions.service.js');
const serverCurrentTime = require('./server-current-time/server-current-time.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(laundryUsersOnline);
  app.configure(laundrySessions);
  app.configure(serverCurrentTime);
};
