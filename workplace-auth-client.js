'use strict';

var superagent = require('superagent');
var protocol = 'https';
var service = 'fns-service';
var apiPath = 'api/1';

exports = function(domain) {
    var url = protocol + '://' + domain + '/' + service + '/' + apiPath;
    
    console.log('serviceURL = ' + url);
    
    return {
        basic: function(username, password, callback) {
            var authURL = url + '/token/basic';
            console.log('authURL = ' + authURL);
            superagent.get(authURL)
                .accept('application/json')
                .auth(username, password)
                .send()
                .end(function(error, response) {
                    console.log(error);
                    if (response.ok) {
                        var token = 'sect ' + new Buffer(username + ':' + response.body.token).toString('base64');
                        callback(null, token);
                    } else {
                        if(callback)
                            callback(error);
                    }
                });
        }
    }
}