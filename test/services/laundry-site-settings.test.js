const assert = require('assert');
const app = require('../../src/app');

describe('\'laundry-site-settings\' service', () => {
  it('registered the service', () => {
    const service = app.service('laundry-site-settings');

    assert.ok(service, 'Registered the service');
  });
});
