const mongoose = require('mongoose');
 
const dbSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    store_location: String,
    location_id: String,
    time_stamp: {
        type: Date,
        default: Date.now(),
    }

});

module.exports = mongoose.model('users', dbSchema);