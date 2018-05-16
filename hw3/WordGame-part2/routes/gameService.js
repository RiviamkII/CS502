var db = require('./db');
var mongo = require('mongodb');
var Game = require('./gameModel');
var COLLECTION = 'games';


function create(userId, colors, font, guesses, level, remaining, status, target, timeStamp, view, cb) {
    var result = new Game(userId, colors, font, guesses, level, remaining, status, target, timeStamp, view);
    db.collection(COLLECTION).insertOne(result, function (err, writeResult) {
        var newGame = writeResult.ops[0];
        delete newGame.target;
        cb(err, newGame);
    })
}
module.exports.create = create;

function findByuserID(userId, cb) {
    db.collection(COLLECTION).find({userId: userId}).toArray(function (err, games) {
        cb(err, games);
    })
}
module.exports.findByuserID = findByuserID;

function findByGameID(gameId, cb) {
    db.collection(COLLECTION).findOne({'_id': new mongo.ObjectId(gameId)}, function (err, game) {
        cb(err, game);
    })
}
module.exports.findByGameID = findByGameID;

function findByUserAndGameID(userId, gameId, cb) {
    db.collection(COLLECTION).findOne({userId: userId, '_id': new mongo.ObjectId(gameId)}, function (err, game) {
        cb(err, game);
    })
}
module.exports.findByUserAndGameID = findByUserAndGameID;

function update(gameId, newGame, cb) {
    db.collection(COLLECTION).update({'_id': new mongo.ObjectId(gameId)}, {$set: newGame}, function (err, update) {
        findByGameID(gameId, cb);
    })
}
module.exports.update = update;