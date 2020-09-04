const bunyan = require('bunyan');
global.global_logger = bunyan.createLogger({ name: 'talentsoft', level: 'error' });

const assert = require('chai').assert;
const config = require('../lib/config');
const path = require('path');
const _ = require('lodash');

describe('Talentsoft config', () => {
  it('should return properties from file using tls', () => {
    return config.resolve(path.resolve(__dirname + '/../test-data/config.yml')).then((config) => {
      assert.equal(config.clientId, 'someid');
      assert.equal(config.clientSecret, 'thesecretshh');
    });
  });
});