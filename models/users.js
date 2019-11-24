const mongoose = require('mongoose');
 
const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    email: String,
    password: {
        required: true,
        type: String
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }]
});

module.exports = mongoose.model('User', userSchema);
