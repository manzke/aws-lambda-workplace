var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var auth = require('workplace-auth-client');
var provisioning = require('workplace-provisioning-client');

console.log('Loading function companies-loader.js');

exports.handler = function(event, context) {
    var runUuid = uuid.v4();

    console.log('Loading companies. run ['+runUuid+']');
    var currTime = new Date().getMilliseconds();

    var config = event;
    var domain = config.workplace.domain;
    var stage = config.workplace.stage || 'PROD';
    var customer = config.workplace.customer || 'ALL';
    var region = config.workplace.region || 'global';
    var username = config.workplace.username;
    var password = config.workplace.password;
    var metrics = config.workplace.metrics;
    var streamName = config.kinesis.name;

    console.log('using domain: ' + domain);

    var authService = auth.configure(domain);
    var kinesis = new AWS.Kinesis({region : config.kinesis.region});

    authService.basic(username, password, function(error, token) {
        var provisioningService = provisioning.configure(token, domain);
        provisioningService.companies(true, function(error, companies){
            companies.forEach(function(company, index, array) {
                var record = JSON.stringify({
                    run: runUuid,
                    time: currTime,
                    token : token,
                    domain : domain,
                    stage : stage,
                    customer : customer,
                    region : region,
                    company : company,
                    username : username,
                    metrics: metrics
                });

                var recordParams = {
                    Data : record,
                    PartitionKey : 'company-' + company.id,
                    StreamName : streamName
                };

                kinesis.putRecord(recordParams, function(err, data) {
                    if (err) {
                        console.error(err);
                        context.failed(err);
                    } else {
                        console.log('Successfully sent data to Kinesis.');
                        if (index === array.length - 1) {
                            context.succeed();
                        }
                    }
                });
            });
        });
    });
};