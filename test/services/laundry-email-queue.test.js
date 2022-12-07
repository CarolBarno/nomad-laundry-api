const assert = require('assert');
const app = require('../../src/app');

describe('\'laundry-email-queue\' service', () => {
  it('registered the service', () => {
    const service = app.service('laundry-email-queue');

    assert.ok(service, 'Registered the service');
  });
});
