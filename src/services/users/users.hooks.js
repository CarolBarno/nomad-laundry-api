const { authenticate } = require('@feathersjs/authentication').hooks;
const verifyHooks = require('feathers-authentication-management').hooks;
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;
const { isProvider, preventChanges, iff } = require('feathers-hooks-common');
const notifier = require('../../hooks/common/notify');
const performAction = require('../../hooks/common/perform-action');
const verification = require('../../hooks/users/verification');

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [
      iff(performAction('AsyncValidator'), verification()).else(hashPassword('password'), verifyHooks.addVerification())
    ],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [
      iff(isProvider('external'), preventChanges(true,
        'isVerified', 'verifyToken', 'verifyShortToken', 'verifyExpires', 'verifyChanges',
        'resetToken', 'resetShortToken', 'resetExpires'
      )),
      hashPassword('password'), authenticate('jwt')
    ],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      iff(
        performAction('sendEmail'),
        context => { notifier(context.app).notifier('resendVerifySignup', context.result, context.data); },
        verifyHooks.removeVerification()
      ),
    ],
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
