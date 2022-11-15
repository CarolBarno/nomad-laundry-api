const { encryptPassword, unprotect } = require('../../hooks/smtp/hash-password');
const { authenticate } = require('@feathersjs/authentication').hooks;
const dehydrate = require('feathers-sequelize/hooks/dehydrate');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'), encryptPassword('smtp_password')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt'), encryptPassword('smtp_password')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [],
    get: [dehydrate(), unprotect()],
    create: [dehydrate(), unprotect()],
    update: [],
    patch: [dehydrate(), unprotect()],
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
