var mongoose = require('mongoose');

var gameSchema = mongoose.Schema({
    userId: String,
    colors:{
        guessBG: String,
        wordBG: String,
        textGB: String
    },
    font: {
        url: String,
        rule: String,
        family: String,
        category: String
    },
    guesses: String,
    level:{
        name: String,
        minLength: Number,
        maxLength: Number,
        guesses: Number
    },
    remaining: Number,
    status: String,
    target: String,
    timeStamp: Number,
    timeToComplete: Number,
    view: String
});

var Games = mongoose.model('Games', gameSchema);//decide name in database, in this case the database name is games
module.exports = Games;

/*function Game(userId, colors, font, guesses, level, remaining, status, target, timeStamp, view) {
    this.userId = userId;
    this.colors = colors;
    this.font = font;
    this.guesses = guesses;
    this.level = level;
    this.remaining = remaining;
    this.status = status;
    this.target = target;
    this.timeStamp = timeStamp;
    this.view = view;
}*/
