// Application hooks that run for every service

const { disallow, iff, isProvider } = require('feathers-hooks-common');
const createdUpdatedBy = require('./hooks/common/created-updated-by');

module.exports = {
  before: {
    all: [disallow('rest'), iff(isProvider('external'), createdUpdatedBy())],
    find: [],
    get: [],
    create: [],
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
