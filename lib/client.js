const bunyan = require('bunyan');
const _ = require('lodash');
const request = require('request');
const axios = require('axios');
const Promise = require('bluebird');
const JSONStream = require('JSONStream');
const stream = require('stream');
const streamToPromise = require('stream-to-promise');
const through2 = require('through2');
const requireyml = require('require-yml');
const config = require('./config');
const path = require('path');

module.exports = client;

function client (config) {
  this.config = config;
  var self = this;
  
  this.login = function (args) {
    self.host = 'https://' + self.config.host;
    return new Promise(function (resolve, reject) {
      var formData = 'client_id=' + self.config.clientId + '&client_secret=' + self.config.clientSecret + '&grant_type=client_credentials';
      var opts = {
        url: self.host + '/api/token',
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        },
        body: formData
      };
      if (self.rejectUnauthorized === false) {
        opts.rejectUnauthorized = false;
      }
      var stream = request.post(opts);
      stream.on('response', (response) => {
        if (response.statusCode === 400) {
          reject(new Error('incorrect credentials'));
        }
        if (response.statusCode !== 200) {
          reject(new Error('error logging in'));
        }
      });
      stream.on('error', (error) => {
        reject(error);
      });

      var resultData = '';
      stream.on('data', (data) => {
        if (data) {
          resultData += data.toString();
        }
      });

      stream.on('end', (data) => {
        try {
          var authentication = JSON.parse(resultData.toString());
          self.authorization = 'Bearer ' + authentication.access_token;
          resolve(authentication);
        } catch (error) {
          console.error({ err: error}, 'error while parsing authentication');
        }
      });
    });
  };
  
  this.get = function (url, args) {
    var opts = {
      url: self.host  + '/' + url,
      headers: {
        'authorization': self.authorization,
        'content-type': 'application/json; charset=utf-8'
      }
    };
    if (self.rejectUnauthorized === false) {
      opts.rejectUnauthorized = false;
    }
    var requestStream = request.get(opts);
    return requestStream;
  }
  
  this.post = function (url, inputStream, args) {
    args = args || {};
    var opts = {
      url: url,
      headers: {
        'authorization': self.authorization,
        'content-type': 'application/json; charset=utf-8'
      }
    };
    if (self.rejectUnauthorized === false) {
      opts.rejectUnauthorized = false;
    }
    var requestStream = request.post(opts);
    
    if (inputStream) {
      return inputStream.pipe(requestStream);
    } else {
      return requestStream;
    }
  };
  
  var promisifyStream = (stream) => {
    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });
      var dataResult = '';
      stream.on('data', (data) => {
        dataResult += data.toString();
      });
      var contentType = '';
      stream.on('response', (response) => {
        if (response.statusCode === 401) {
          reject(new Error('unauthorized'));
        }
        if (response.statusCode === 403) {
          reject(new Error('forbidden'));
        }
        contentType = response.headers['content-type'] || '';
      });
      
      stream.on('end', () => {
        resolve(dataResult);
      });
    });
  };
  
  this.promisifyStream = promisifyStream;
  
  this.getLogs = function (url, start, pass) {
    return step({
      start: start,
      max: 1000,
      latestLogId: 0
    });
    
    function step(args) {
      var stream = self.get(url + '?startingFromLogId=' + args.start + '&maxNumberOfLogs=' + args.max)
      .pipe(JSONStream.parse('*'))
      .pipe(through2.obj(function (obj, enc, callback) {
        var number = parseInt(obj.logId, 10);
        if (number > args.latestLogId){
          args.latestLogId = number;
        }
        this.push(obj);
        callback();
      }));
      stream.pipe(pass, { end: false });
      return streamToPromise(stream)
      .then(function () {
        if (args.latestLogId < (args.start + args.max - 1)) {
          pass.end();
          return Promise.resolve(args.latestLogId);
        } else {
          return step({
            start: args.latestLogId + 1,
            max: args.max,
            latestLogId: args.latestLogId
          });
        }
      });
    }
  }
  this.promise = {
    get: function (url) {
      return self.promisifyStream(self.get(url));
    },
    post: function (url) {
      return self.promisifyStream(self.post(url));
    },
    getLastestLogId: function (url) {
      return step({
        start: 0,
        max: 1000,
        latestLogId: 0
      });
      
      function step(args) {
        var stream = self.get(url + '?startingFromLogId=' + args.start + '&maxNumberOfLogs=' + args.max).pipe(JSONStream.parse('.logId'))
        .pipe(through2(function (obj, enc, callback) {
          var number = parseInt(obj.toString(), 10);
          if (number > args.latestLogId){
            args.latestLogId = number;
          }
          callback();
        }));
        return streamToPromise(stream)
        .then(function () {
          if (args.latestLogId < (args.start + args.max - 1)) {
            return Promise.resolve(args.latestLogId);
          } else {
            return step({
              start: args.latestLogId + 1,
              max: args.max,
              latestLogId: args.latestLogId
            });
          }
        });
      }
    },
    getLogs: function (url, start) {
      return step({
        start: start,
        max: 1000,
        latestLogId: 0
      });
      
      function step(args) {
        var stream = self.get(url + '?startingFromLogId=' + args.start + '&maxNumberOfLogs=' + args.max).pipe(JSONStream.parse('.logId'))
        .pipe(through2(function (obj, enc, callback) {
          var number = parseInt(obj.toString(), 10);
          if (obj > args.latestLogId){
            args.latestLogId = number;
          }
          callback();
        }));
        return streamToPromise(stream)
        .then(function () {
          if (args.latestLogId < (args.start + args.max - 1)) {
            return Promise.resolve(args.latestLogId);
          } else {
            return step({
              start: args.latestLogId + 1,
              max: args.max,
              latestLogId: args.latestLogId
            });
          }
        });
      }
    }
  };
}
