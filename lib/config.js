const requireyml = require('require-yml');
const Promise = require('bluebird');
const defaultConfigPath = '/etc/talentsoft-config/';
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const _ = require('lodash');

function getConfiguredTalentsoft(configBasePath) {
  try {
    var ads = fs.readdirSync(configBasePath).filter(function (file) {
      let filePath = path.resolve(configBasePath, file);
      if (fs.statSync(filePath).isDirectory()) {
        return false;
      } else {
        return true;
      }
    });
    return Promise.resolve(ads);
  } catch(error) {
    //probably couldn't find directory
    logger.error({ err: error });
    return Promise.resolve([]);
  }
}

function resolveDirectory (configPath) {
  if (!configPath) {
    configPath = defaultConfigPath;
  }
  return resolve(path.resolve(configPath))
  .then((config) => {
    //set resolve
    return Object.assign({ resolved: typeof config !== 'undefined' }, config);
  });
}

function resolve (configPath) {
  return Promise.resolve(requireyml(path.resolve(configPath)));
}

module.exports = {
  initiateConfigs: function (args) {
    return getConfiguredTalentsoft(args.configBasePath)
    .then((adConfigFilePaths) => {
      let result = {};
      return Promise.map(adConfigFilePaths, (filePath) => {
        return resolveDirectory(path.resolve(args.configBasePath, filePath))
        .then((config) => {
          result[filePath.replace('.yml', '')] = config;
        });
      })
      .then(() => result);
    });
  },
  resolveDirectory: resolveDirectory,
  resolve: resolve
};