var AWS = require('aws-sdk');

var config = require('config');
console.log('using config: ' + config);
config = config.loader.metrics;

var streamName = config.kinesis.name;

var workplaceBuilder = require('workplace-service-client');

var firehose = new AWS.Firehose({region : config.kinesis.region});

console.log('Loading function companies-loader.js');

exports.handler = function(event, context) {
    var currTime = new Date().getMilliseconds();
    event.Records.forEach(function(record, index, array) {
        // Kinesis data is base64 encoded so decode here
        var decodedPayload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
        console.log('Decoded payload:', decodedPayload);
        var payload = JSON.parse(decodedPayload);

        var domain = payload.domain;
        var token = payload.token;
        var company = payload.company;
        var metrics = payload.metrics;
        var client = workplaceBuilder.configure(token, domain);

        client.metrics(metrics, company, function(error, metrics) {
            console.log('metrics ' + JSON.stringify(metrics));
            var record = JSON.stringify({
                run: payload.run,
                time: currTime,
                stage : payload.stage,
                region : payload.region,
                domain : domain,
                customer : payload.customer,
                company : company,
                metrics: metrics
            });

            var recordParams = {
                DeliveryStreamName : streamName,
                Record : {
                    Data : record
                }
            };

            firehose.putRecord(recordParams, function(err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Successfully sent data to Firehose.');
                }

                if (index === array.length - 1) {
                    context.done(err, data);
                }
            });
        });
    });
};