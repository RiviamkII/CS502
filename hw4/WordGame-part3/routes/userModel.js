var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    role: String,
    enabled: Boolean,
    name: {
        firstName: String,
        lastName: String
    },
    email: String,
    password: String,
    defaults:{
        font: {
            url: String,
            rule: String,
            family: String,
            category: String
        },
        colors:{
            guessBG: String,
            wordBG: String,
            textBG: String
        },
        level:{
            name: String,
            minLength: Number,
            maxLength: Number,
            guesses: Number
        }
    }
});

var Users = mongoose.model('Users', userSchema);
module.exports = Users;