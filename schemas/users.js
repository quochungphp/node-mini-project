const mongoose = require('mongoose');
const collectionConfig = require(__path_configs + 'collectionSchemas');

var schema = new mongoose.Schema({
    fullname: String,
    status: String,
    password: String,
    username: String,
    salt: String,
    login_at: Date,
    group: {
        id: String,
        name: String
    },
    created: {
        user_id: Number,
        user_name: String,
        time: Date
    },
    modified: {
        user_id: Number,
        user_name: String,
        time: Date
    }
});

module.exports = mongoose.model(collectionConfig.collection_users, schema);
