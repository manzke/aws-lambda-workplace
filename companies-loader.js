var AWS = require('aws-sdk');
var auth = require('workplace-auth-client');
var provisioning = require('workplace-provisioning-client');

console.log('Loading function companies-loader.js');

exports.handler = function(event, context) {
    var currTime = new Date().getMilliseconds();

    var config = event;
    var domain = config.workplace.domain;
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
                    time: currTime,
                    token : token,
                    domain : domain,
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