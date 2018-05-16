/*
var mongoClient = require('mongodb').MongoClient;
var db;

mongoClient.connect("mongodb://localhost:27017", function (err, clients) {
    if(err) throw err;
    db = clients.db("wordGame");
});

module.exports = { collection : (name) => db.collection(name)};
*/
/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wordGame');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

});*/
