'use strict';

var config = module.exports = {
    loader : {
        companies : {
            kinesis : {
                region : 'eu-west-1',
                name: 'name_of_your_kinesis_stream'
            },

            workplace : {
                stage : 'DEV',
                region : 'EU',
                customer : 'ALL',
                domain : '',
                username : '',
                password : '',
                metrics : 'documents_total_storage_size,usercount,documentcount,spacecount,foldercount,sharecount,documents_links_count,documents_comments_count,documents_activities_count,logged_in_usercount'
            }
        },
        metrics : {
            kinesis : {
                region : 'eu-west-1',
                name: 'name_of_your_kinesis_stream'
            }
        }
    }
};