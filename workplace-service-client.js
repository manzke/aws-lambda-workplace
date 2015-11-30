'use strict';

var superagent = require('superagent');
var protocol = 'https';
var service = 'fns-service';
var apiPath = 'api/1';

exports.configure = function(token, domain) {
    var url = protocol + '://' + domain + '/' + service + '/' + apiPath;

    console.log('serviceURL = ' + url);

    return {
        metrics: function(metricNames, company, callback) {
            var metricsURL = url + '/metrics/' + metricNames;
            var _companyId = company.id;
            var _companyName = company.name;
            console.log('metricsURL = ' + metricsURL);
            superagent.get(metricsURL)
                .accept('application/json')
                .set('Authorization', token)
                .set('Manage-Scope', 'account:' + _companyId)
                .send()
                .end(function(error, response) {
                    console.log(error);
                    if (response.ok) {
                        response.body.companyName = _companyName;
                        callback(null, response.body);
                    } else {
                        if(callback)
                            callback(error);
                    }
                });

        }
    }

}