var superagent = require('superagent');
var protocol = 'https';
var service = 'provisioning';
var apiPath = 'api/1';

exports.configure = function(token, domain) {
    var url = protocol + '://' + domain + '/' + service + '/' + apiPath;

    console.log('serviceURL = ' + url);
    
    return {
        company: function(id, callback) {
            var companyURL = url + '/companies/' + id;
            console.log('companyURL = ' + companyURL);
            superagent.get(companyURL)
                .accept('application/json')
                .set('Authorization', token)
                .send()
                .end(function(error, response) {
                    console.log(error);
                    if (response.ok) {
                        callback(null, response.body);
                    } else {
                        if(callback)
                            callback(error);
                    }
                });
        },
        
        companies: function(callback) {
            var companiesURL = url + '/companies';
            console.log('companiesURL = ' + companiesURL);
            superagent.get(companiesURL)
                .accept('application/json')
                .set('Authorization', token)
                .send()
                .end(function(error, response) {
                    console.log(error);
                    if (response.ok) {
                        callback(null, response.body);
                    } else {
                        if(callback)
                            callback(error);
                    }
                });
        }
    }
}