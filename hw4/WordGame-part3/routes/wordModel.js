var mongoose = require('mongoose');

var wordSchema = mongoose.Schema({
    wordList: [String]
});

var Words = mongoose.model('Words', wordSchema);
module.exports = Words;