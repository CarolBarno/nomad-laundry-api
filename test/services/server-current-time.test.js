const assert = require('assert');
const app = require('../../src/app');

describe('\'server-current-time\' service', () => {
  it('registered the service', () => {
    const service = app.service('server-current-time');

    assert.ok(service, 'Registered the service');
  });
});
