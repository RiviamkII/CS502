var Game = require('./gameModel');

function create(userId, colors, font, guesses, level, remaining, status, target, timeStamp, timeToComplete, view, cb) {
    new Game({userId, colors, font, guesses, level, remaining, status, target, timeStamp, timeToComplete, view})
        .save(function (err, savedGame, numAffected) {
            if(err){
                return err;
            }else{
                cb(err, savedGame);
            }
        });
}
module.exports.create = create;

function findByuserID(userId, cb) {
   // Game.find({userId: userId}, (err, result)=> console.log("game find by id result: ",result));
    Game.find({userId: userId},cb);
}
module.exports.findByuserID = findByuserID;

function findByGameID(gameId, cb) {
    Game.findById(gameId,cb);
}
module.exports.findByGameID = findByGameID;

function update(gameId, newGame, cb) {
    Game.update({_id: gameId}, newGame, function (err, numAffected) {
        if(err) return err;
        findByGameID(gameId, cb);
    });
}
module.exports.update = update;