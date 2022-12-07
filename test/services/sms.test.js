const assert = require('assert');
const app = require('../../src/app');

describe('\'sms\' service', () => {
  it('registered the service', () => {
    const service = app.service('sms');

    assert.ok(service, 'Registered the service');
  });
});
