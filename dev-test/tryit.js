const bunyan = require('bunyan');
global.global_logger = bunyan.createLogger({ name: 'talentsoft', level: 'error' });

const config = require('../index').config;
const Client = require('../index').Client;
const path = require('path');
const through2 = require('through2');

return config.resolve(path.resolve(__dirname + '/config.yml'))
.then(function (config) {
    var client = new Client(config);
    return client.login().then(function (token) {
        //console.log(token);
        //return client.promisifyStream(client.get('/api/hub/v2/libraries/GeographicOrganisationStructure')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/libraries/RegulationName')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/libraries/RegulationRegion')).then(console.log);
        
        //return client.promisifyStream(client.get('/api/hub/v2/libraries/WorkingTime')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/positions/structure')).then(console.log);
        
        //return client.get('/api/hub/v2/libraries/OrganisationalStructure').pipe(process.stdout);//.then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/employees/logs?startingFromLogId=42830&maxNumberOfLogs=100')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/positions')).then(console.log);
        //return client.promisifyStream(client.get(host + '/api/hub/v2/positions/consult_generic_01')).then(console.log);
        //return client.promisifyStream(client.get(host + '/api/hub/v2/positionassignments/underdirektoer_11')).then(console.log);
        //return client.promisifyStream(client.get(host + '/api/hub/v2/employees/1000907')).then(console.log);
        
        //return client.promise.getLastestLogId('/api/hub/v2/employees/logs').then(console.log);
        var results = [];
        var stream = through2.obj(function (obj, enc, callback) {
            results.push(obj.logId);
            callback();
        });
        return client.getLogs('/api/hub/v2/employees/logs', 41200, stream).then(function (latestLogId) {
            console.log('collected', results.length);
            console.log('latestLogId', latestLogId);
        });
    });
});