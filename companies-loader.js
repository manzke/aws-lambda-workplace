var AWS = require('aws-sdk');
var async = require('async');

var config = require('config')
var domain = config.workplace.domain;
var username = config.workplace.username;
var password = config.workplace.password;

var authService = require('workplace-auth-client')(domain);
var provisioningBuilder = require('workplace-provisioning-client');

var kinesis = new AWS.Kinesis({region : config.kinesis.region});

console.log('Loading function companies-loader.js');

exports.handler = function(event, context) {
    var currTime = new Date().getMilliseconds();

    authService.basic(username, password, function(error, token) {
        var provisioningService = provisioningBuilder(token, domain);
        provisioningService.companies(function(error, companies){
            async.map(companies, function(company) {
                var record = JSON.stringify({
                  time: currTime,
                  token : token,
                  company : company
                });
            
                var recordParams = {
                    Data : record,
                    PartitionKey : 'company-' + company.id,
                    StreamName : 'process-companies-stream'
                };
                
                kinesis.putRecord(recordParams, function(err, data) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Successfully sent data to Kinesis.');
                    }
                });
            });
        });
    });
};