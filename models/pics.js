const mongoose = require('mongoose');

const picSchema = new mongoose.Schema({
    url: {type: String, required: true },
    caption: String
});


module.exports = mongoose.model('Pic', picSchema);