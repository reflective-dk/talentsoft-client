const bunyan = require('bunyan');
global.global_logger = bunyan.createLogger({ name: 'talentsoft', level: 'error' });

const config = require('../index').config;
const Client = require('../index').Client;
const path = require('path');
const through2 = require('through2');

return config.resolve(path.resolve(__dirname + '/home.config.yml'))
.then(function (config) {
    var client = new Client(config);
    return client.login().then(function (token) {
        //console.log(token);
        //return client.promisifyStream(client.get('/api/hub/v2/libraries/GeographicOrganisationStructure')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/libraries/RegulationName')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/libraries/logs?startingFromLogId=53600&maxNumberOfLogs=100')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/libraryTypes')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/libraries/RegulationRegion')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/libraries/ResponsibilityLevel')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/libraries/WorkingTime')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/positions/afdelingsleder_0008')).then(console.log);
        //return client.get('/api/hub/v2/libraries/OrganisationalStructure').pipe(process.stdout);//.then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/employees/logs?startingFromLogId=null&maxNumberOfLogs=1000')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/positions/logs?startingFromLogId=54946&maxNumberOfLogs=1000')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/positions/Afdelingsleder_0002')).then(console.log);
        //return client.promisifyStream(client.get('/api/hub/v2/positionassignments/underdirektoer_11')).then(console.log);
        return client.promisifyStream(client.get('/api/hub/v2/employees/1001723')).then(console.log);
        //client.promise.getLogs('/api/hub/v2/employees/logs', 501705, process.stdout);
        //return client.promise.getLastestLogId('/api/hub/v2/positions/logs').then(console.log);
        //return client.promise.getLastestLogId('/api/hub/v2/libraries/logs').then(console.log);
        //return client.promise.getLastestLogId('/api/hub/v2/employees/logs').then(console.log);
        /*var results = [], first;
        var stream = through2.obj(function (obj, enc, callback) {
            if (!first) {
                first = obj.logId;
            }
            results.push(obj.logId);
            callback();
        });
        return client.getLogs('/api/hub/v2/employees/logs', 501705, stream).then(function (result) {
            console.log('first', first);
            console.log('collected', result.collected);
            console.log('nextLogId', result.nextLogId);
        });*/
    });
});