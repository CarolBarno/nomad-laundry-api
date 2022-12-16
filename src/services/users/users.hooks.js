const { authenticate } = require('@feathersjs/authentication').hooks;
const verifyHooks = require('feathers-authentication-management').hooks;
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;
const { isProvider, preventChanges, iff } = require('feathers-hooks-common');
const performAction = require('../../hooks/common/perform-action');
const verification = require('../../hooks/users/verification');
const notifier = require('../auth-management/notify');
const { userRoute } = require('../../hooks/common/shared-util');
const changePasswordAck = require('../../hooks/users/change-password-ack');
const userChangePassword = require('../../hooks/users/user-change-password');
const enforcePasswordChange = require('../../hooks/users/enforce-password-change');

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [
      iff(performAction('AsyncValidator'), verification()), hashPassword('password'), verifyHooks.addVerification()
    ],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [
      iff(isProvider('external'), preventChanges(true, 'isVerified', 'verifyToken', 'verifyExpires', 'verifyChanges', 'resetToken', 'resetExpires')),
      iff(performAction('validUserChangePassword'), authenticate('jwt'), userChangePassword(),hashPassword('password')).else(
        authenticate('jwt'),
        iff(isProvider('external'), enforcePasswordChange()),
        hashPassword('password')
      )
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
    patch: [
      iff(userRoute('ackUserPasswordChange'), changePasswordAck())
    ],
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
