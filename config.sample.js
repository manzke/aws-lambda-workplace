'use strict';

var config = module.exports = {
    kinesis : {
        region : 'eu-west-1',
        name: 'name_of_your_kinesis_stream'
    },

    workplace : {
        domain : '',
        username : '',
        password : '',
        metrics : 'documents_total_storage_size,usercount,documentcount,spacecount,foldercount,sharecount,documents_links_count,documents_comments_count,documents_activities_count,logged_in_usercount'
    }
};