const { iff } = require('feathers-hooks-common');
const performAction = require('../../hooks/common/perform-action');
const userVerification = require('../../hooks/register/user-verification');
const welcomeEmail = require('../../hooks/users/welcome-email');


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      iff(performAction('sendOTP'), userVerification()),
      iff(performAction('userRegistration'), welcomeEmail())
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
