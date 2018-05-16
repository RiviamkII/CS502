var db = require('./db');
var mongo = require('mongodb');
var COLLECTION = 'users';

function findByID(id, cb) {
    db.collection(COLLECTION).findOne({'_id': new mongo.ObjectId(id)}, function (err, user) {
        cb(err, user);
    });
}
module.exports.findByID = findByID;

function findByEmail(email, cb) {
    db.collection(COLLECTION).findOne({email: email}, function (err, user) {
        cb(err, user);
    });
}
module.exports.findByEmail = findByEmail;

function update(id, defaults, cb) {
    db.collection(COLLECTION).update({'_id': new mongo.ObjectId(id)}, {$set: {defaults: defaults}}, function (err, update) {
        if(err){throw err}
        findByID(id, cb);
    });
}
module.exports.update = update;