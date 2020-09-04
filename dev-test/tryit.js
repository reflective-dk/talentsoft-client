const client = new (require('../lib/client'))({});
var host = 'https://testbankdata.talent-soft.com';

return client.login().then(function (token) {
    //console.log(token);
    return client.promisifyStream(client.get(host + '/api/hub/v2/libraries/OrganisationalStructure')).then(console.log);
    //return client.promisifyStream(client.get(host + '/api/hub/v2/libraries/GeographicOrganisationStructure')).then(console.log);
    //return client.promisifyStream(client.get(host + '/api/hub/v2/employees/logs?startingFromLogId=41000&maxNumberOfLogs=1000')).then(console.log);
    //return client.promisifyStream(client.get(host + '/api/hub/v2/positions')).then(console.log);
    //return client.promisifyStream(client.get(host + '/api/hub/v2/positions/structure')).then(console.log);
    //return client.promisifyStream(client.get(host + '/api/hub/v2/positions/consult_generic_01')).then(console.log);
    //return client.promisifyStream(client.get(host + '/api/hub/v2/positionassignments/underdirektoer_11')).then(console.log);
    //return client.promisifyStream(client.get(host + '/api/hub/v2/employees/1000907')).then(console.log);
    
    
}); 