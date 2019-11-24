const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    title: String,
    items: [],
    dueDate: Date
});

const List = mongoose.model('List', listSchema);

module.exports = List;
