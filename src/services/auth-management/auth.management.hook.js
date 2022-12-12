const common = require('feathers-hooks-common');
const performAction = require('../../hooks/common/perform-action');
exports.before = {
  all: [],
  find: [],
  get: [],
  create: [common.iff(performAction('passwordChange', 'identityChange'))],
  update: [],
  patch: [],
  remove: []
};