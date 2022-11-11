const assert = require('assert');
const app = require('../../src/app');

describe('\'otp\' service', () => {
  it('registered the service', () => {
    const service = app.service('otp');

    assert.ok(service, 'Registered the service');
  });
});
