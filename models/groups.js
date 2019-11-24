const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {type:String, required: true},
    dateStarted: {type: Date, required: true},
    groupPhoto: {type: String, required: true},
    pics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pic'
    }],
    lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    }],
    recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }]
});


module.exports = mongoose.model('Group', groupSchema);