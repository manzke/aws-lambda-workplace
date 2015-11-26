var AWS = require('aws-sdk');

var config = require('config')
var domain = config.workplace.domain;
var username = config.workplace.username;
var password = config.workplace.password;
var streamName = config.kinesis.name;

console.log('using domain: ' + domain);

var authService = require('workplace-auth-client').configure(domain);
var provisioningBuilder = require('workplace-provisioning-client');

var kinesis = new AWS.Kinesis({region : config.kinesis.region});

console.log('Loading function companies-loader.js');

exports.handler = function(event, context) {
    var currTime = new Date().getMilliseconds();

    authService.basic(username, password, function(error, token) {
        var provisioningService = provisioningBuilder.configure(token, domain);
        provisioningService.companies(function(error, companies){
            companies.forEach(function(company, index, array) {
                var record = JSON.stringify({
                  time: currTime,
                  token : token,
                  company : company
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