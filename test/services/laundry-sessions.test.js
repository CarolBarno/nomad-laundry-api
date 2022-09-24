const assert = require('assert');
const app = require('../../src/app');

describe('\'laundry-sessions\' service', () => {
  it('registered the service', () => {
    const service = app.service('laundry-sessions');

    assert.ok(service, 'Registered the service');
  });
});
