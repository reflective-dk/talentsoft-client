const bunyan = require('bunyan');
global.global_logger = bunyan.createLogger({ name: 'talentsoft', level: 'error' });

const assert = require('chai').assert;
const config = require('../lib/config');
const path = require('path');
const _ = require('lodash');

describe('Talentsoft Log Count', () => {
  it('should find latest LogId', () => {
  });
});