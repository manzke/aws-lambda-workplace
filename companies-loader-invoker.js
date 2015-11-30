var config = require('config');
var companiesLoader = require('companies-loader');

console.log('Loading function companies-loader-invoker.js');

exports.handler = function(event, context) {
    console.log('using config: ' + config);
    companiesLoader.handler(config, context);
};