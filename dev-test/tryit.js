const bunyan = require('bunyan');
global.global_logger = bunyan.createLogger({ name: 'talentsoft', level: 'error' });

const config = require('../index').config;
const Client = require('../index').Client;
const path = require('path');

return config.resolve(path.resolve(__dirname + '/config.yml'))
.then(function (config) {
    var client = new Client(config);
    return client.login().then(function (token) {
        //console.log(token);
        return client.promise.get('/api/hub/v2/libraries/OrganisationalStructure').then(console.log);
        //return client.promisifyStream(client.get(host + '/api/hub/v2/libraries/GeographicOrganisationStructure')).then(console.log);
        //return client.promisifyStream(client.get(host + '/api/hub/v2/employees/logs?startingFromLogId=41000&maxNumberOfLogs=1000')).then(console.log);
        //return client.promisifyStream(client.get(host + '/api/hub/v2/positions')).then(console.log);
        //return client.promisifyStream(client.get(host + '/api/hub/v2/positions/structure')).then(console.log);
        //return client.promisifyStream(client.get(host + '/api/hub/v2/positions/consult_generic_01')).then(console.log);
        //return client.promisifyStream(client.get(host + '/api/hub/v2/positionassignments/underdirektoer_11')).then(console.log);
        //return client.promisifyStream(client.get(host + '/api/hub/v2/employees/1000907')).then(console.log);
        
        
    });
});