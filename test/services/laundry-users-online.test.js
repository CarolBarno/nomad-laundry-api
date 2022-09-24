const assert = require('assert');
const app = require('../../src/app');

describe('\'laundry-users-online\' service', () => {
  it('registered the service', () => {
    const service = app.service('laundry-users-online');

    assert.ok(service, 'Registered the service');
  });
});
