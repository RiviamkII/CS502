var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var fs = require('fs');
var users = require('./userService');
var game = require('./gameService');
var wordList = require('./words');

var games = [];
var targets = [];
var levels = {
    "Easy": {"name": "Easy", "minLength": 3, "maxLength": 5, "guesses": 8},
    "Medium": {"name": "Medium", "minLength": 4, "maxLength": 10, "guesses": 7},
    "Hard": {"name": "Hard", "minLength": 9, "maxLength": 300, "guesses": 6}
};

var fonts = [{
    "url": "https://fonts.googleapis.com/css?family=Acme",
    "rule": "'Acme', Sans Serif",
    "family": "Acme",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Alef",
    "rule": "'Alef', Sans Serif",
    "family": "Alef",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Almendra",
    "rule": "'Almendra', Serif",
    "family": "Almendra",
    "category": "Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Amiko",
    "rule": "'Amiko', Sans Serif",
    "family": "Amiko",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Armata",
    "rule": "'Armata', Sans Serif",
    "family": "Armata",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Artifika",
    "rule": "'Artifika', Serif",
    "family": "Artifika",
    "category": "Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Bentham",
    "rule": "'Bentham', Serif",
    "family": "Bentham",
    "category": "Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Cabin%20Sketch",
    "rule": "'Cabin Sketch', Display",
    "family": "Cabin Sketch",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Capriola",
    "rule": "'Capriola', Sans Serif",
    "family": "Capriola",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Content",
    "rule": "'Content', Display",
    "family": "Content",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Contrail One",
    "rule": "'Contrail One', Display",
    "family": "Contrail One",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Convergence",
    "rule": "'Convergence', Sans Serif",
    "family": "Convergence",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Delius Unicase",
    "rule": "'Delius Unicase', Handwriting",
    "family": "Delius Unicase",
    "category": "Handwriting"
}, {
    "url": "https://fonts.googleapis.com/css?family=Didact Gothic",
    "rule": "'Didact Gothic', Sans Serif",
    "family": "Didact Gothic",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Dorsa",
    "rule": "'Dorsa', Sans Serif",
    "family": "Dorsa",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Dynalight",
    "rule": "'Dynalight', Display",
    "family": "Dynalight",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=El Messiri",
    "rule": "'El Messiri', Sans Serif",
    "family": "El Messiri",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Flamenco",
    "rule": "'Flamenco', Display",
    "family": "Flamenco",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Fugaz One",
    "rule": "'Fugaz One', Display",
    "family": "Fugaz One",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Galada",
    "rule": "'Galada', Display",
    "family": "Galada",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Geostar Fill",
    "rule": "'Geostar Fill', Display",
    "family": "Geostar Fill",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Gravitas%20One",
    "rule": "'Gravitas One', Display",
    "family": "Gravitas One",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Gudea",
    "rule": "'Gudea', Sans Serif",
    "family": "Gudea",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=IM%20Fell%20English",
    "rule": "'IM Fell English', Serif",
    "family": "IM Fell English",
    "category": "Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Kranky",
    "rule": "'Kranky', Display",
    "family": "Kranky",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Kreon",
    "rule": "'Kreon', Serif",
    "family": "Kreon",
    "category": "Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Lobster",
    "rule": "'Lobster', Display",
    "family": "Lobster",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Lora",
    "rule": "'Lora', Serif",
    "family": "Lora",
    "category": "Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Medula%20One",
    "rule": "'Medula One', Display",
    "family": "Medula One",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Miss%20Fajardose",
    "rule": "'Miss Fajardose', Handwriting",
    "family": "Miss Fajardose",
    "category": "Handwriting"
}, {
    "url": "https://fonts.googleapis.com/css?family=Moulpali",
    "rule": "'Moulpali', Display",
    "family": "Moulpali",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Over%20the%20Rainbow",
    "rule": "'Over the Rainbow', Handwriting",
    "family": "Over the Rainbow",
    "category": "Handwriting"
}, {
    "url": "https://fonts.googleapis.com/css?family=Padauk",
    "rule": "'Padauk', Sans Serif",
    "family": "Padauk",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Podkova",
    "rule": "'Podkova', Serif",
    "family": "Podkova",
    "category": "Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Risque",
    "rule": "'Risque', Display",
    "family": "Risque",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Sahitya",
    "rule": "'Sahitya', Serif",
    "family": "Sahitya",
    "category": "Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Sarala",
    "rule": "'Sarala', Sans Serif",
    "family": "Sarala",
    "category": "Sans Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Shadows%20Into%20Light",
    "rule": "'Shadows Into Light', Handwriting",
    "family": "Shadows Into Light",
    "category": "Handwriting"
}, {
    "url": "https://fonts.googleapis.com/css?family=Source%20Serif%20Pro",
    "rule": "'Source Serif Pro', Serif",
    "family": "Source Serif Pro",
    "category": "Serif"
}, {
    "url": "https://fonts.googleapis.com/css?family=Squada%20One",
    "rule": "'Squada One', Display",
    "family": "Squada One",
    "category": "Display"
}, {
    "url": "https://fonts.googleapis.com/css?family=Yesteryear",
    "rule": "'Yesteryear', Handwriting",
    "family": "Yesteryear",
    "category": "Handwriting"
}];

var defaults = {
    "font": {
        "url": "https://fonts.googleapis.com/css?family=Acme",
        "rule": "'Acme', Sans Serif",
        "family": "Acme",
        "category": "Sans Serif"
    },
    "colors": {guessBG: "#ffffff", wordBG: "#aaaaaa", textBG: "#000000"},
    "level": {"name": "Medium", "minLength": 4, "maxLength": 10, "guesses": 7}
};


function setWordList() {
    fs.readFile('public/file/wordlist.txt', "UTF-8", function (err, data) {
        if (err) {
            return console.error(err);
        }
        targets = data.split("\n");
        //console.log("target before: ",targets);
        wordList.create(targets, function (err, resultwordlist) {
            console.log("Saved successfully");
        });
    });
}

function getWordList() {
    wordList.findAll(function (err, wordlist) {
        var words = wordlist[0];
        targets = words.wordList;
    })
}

function getFont(fontFamily) {
    for (let i = 0; i < fonts.length; i++) {
        if (fonts[i].family === fontFamily) {
            return fonts[i];
        }
    }
}

function changeGameView(view, target, guess) {
    view = view.split("");
    for (let i = 0; i < guess.length; i++) {
        for (let j = 0; j < target.length; j++) {
            if (target.charAt(j) === guess.charAt(i).toUpperCase()) {
                view[j] = (guess.toUpperCase().charAt(i));
            }
        }
    }
    return view.join("");
}

function checkIfSuccess(guess, target) {
    for (let i = 0; i < target.length; i++) {
        let num = guess.toUpperCase().indexOf(target.toUpperCase().charAt(i));
        if (num < 0) {
            return false;
        }
    }
    return true;
}

function selectTarget(level) {
    var minLength = level.minLength;
    var maxLength = level.maxLength;
    var index;
    while (true) {
        index = Math.floor(Math.random() * targets.length);
        if (targets[index].length >= minLength && targets[index].length <= maxLength) {
            return targets[index];
        }
    }
}

function compareWord(guessWord, curGame) {
    curGame.guesses += guessWord;
    if (curGame.target.indexOf(guessWord.toUpperCase()) < 0) {
        curGame.remaining--;
    }
    curGame.view = changeGameView(curGame.view, curGame.target, curGame.guesses);
    if (curGame.remaining === 0 || checkIfSuccess(curGame.guesses, curGame.target)) {
        curGame.timeToComplete = new Date().getTime() - curGame.timeStamp;
        if (checkIfSuccess(curGame.guesses, curGame.target)) {
            curGame.status = "WIN";
        } else {
            curGame.status = "LOSS"
        }
    }
    return curGame;
}

/*****************************ROUTES**********************************/
router.get('/wordgame', function (req, res, next) {
    //setWordList();
    getWordList();
    res.sendFile('index.html', {root: __dirname + "/../public"});
});

router.get('/wordgame/api/v3/meta', function (req, res, next) {
    res.json({
        "levels": levels,
        "fonts": fonts,
        "defaults": defaults
    });
});

router.all('/wordgame/api/v3/:userid*', function (req, res, next) {//validate
    let csrfInRequest = req.header("csrf_Token");
    let csrfInSession = req.session.csrf_token;
    let authenticatedUser = req.session.user;
    users.findById(req.params.userid, function (err, userInDB) {
        if (authenticatedUser && userInDB && authenticatedUser._id == userInDB._id && csrfInRequest == csrfInSession) {
            next();
        } else {
            req.session.regenerate(function (err) {
                res.status(403).json("No permission. Maybe timeout or visit illegal.");
            });
        }
    });
});

router.get('/wordgame/api/v3/meta/fonts', function (req, res, next) {
    res.send(fonts);
});

router.get('/wordgame/api/v3/userid', function (req, res, next) {
    var sid = uuid();
    games[sid] = [];
    res.setHeader('X-sid', sid);
    res.send();
});

router.post('/wordgame/api/v3/:userid', function (req, res, next) {
    let font = getFont(req.headers["x-font"]);
    let level = levels[req.query.level];
    let colors = req.body;
    let userid = req.params.userid;
    let view = "";
    let timeStamp = new Date().getTime();
    if (!userid) {
        res.send({msg: "sid is null"});
        return;
    }
    var target = selectTarget(level).toUpperCase();
    for (var i = 0; i < target.length; i++) {
        view += "_";
    }
    game.create(userid, colors, font, "", level, level.guesses, "Unfinished", target, timeStamp, null, view, function (err, newGame) {
        res.json(newGame);
    });
});

router.get('/wordgame/api/v3/:userid/:gid', function (req, res, next) {
    let gameId = req.params.gid;
    game.findByGameID(gameId, function (err, gameInDB) {
        gameInDB = gameInDB.toObject();
        if (err) {
            res.send(err);
        } else {
            if (gameInDB.status === "Unfinished") {
                delete gameInDB.target;
            }
            res.json(gameInDB);
        }
    });
});

router.get('/wordgame/api/v3/:userid', function (req, res, next) {
    let userid = req.params.userid;
    game.findByuserID(userid, function (err, gamesInDB) {
        if (err) {
            res.status(403).send(err);
        } else {
            let updateGame = [];
            for (let i in gamesInDB) {
                gamesInDB[i] = gamesInDB[i].toObject();
                if (gamesInDB[i].status === "Unfinished") {
                    delete gamesInDB[i].target;
                }
                updateGame.push(gamesInDB[i]);
            }
            res.json(updateGame);
        }
    });
});

router.post('/wordgame/api/v3/:userid/:gid/guesses', function (req, res, next) {
    let guessWord = req.query.guess;
    let gameId = req.params.gid;
    game.findByGameID(gameId, function (err, resultGame) {
        resultGame = resultGame.toObject();
        if (err) {
            res.status(403).send(err);
        } else {
            if (resultGame.guesses.indexOf(guessWord) >= 0) {
                res.json({err: 'This word has already guessed'});
                return;
            }
            if (resultGame.remaining < 0 || resultGame.status === "WIN" || resultGame.status === "LOSS") {
                res.json({err: 'This game has already done, you can not guess '});
            }
            let updateGame = compareWord(guessWord, resultGame);
            game.update(gameId, updateGame, function (err, gameInDB) {
                if (err) {
                    res.status(403).send(err);
                } else {
                    if (gameInDB.status === "Unfinished") {
                        delete gameInDB.target;
                    }
                    res.json(gameInDB);
                }
            })
        }
    });
});

router.put('/wordgame/api/v3/:userid/defaults', function (req, res, next) {
    let userid = req.params.userid;
    let defaults = req.body;
    users.updateUserDefault(userid, defaults, function (err, update) {
        if (err) {
            res.status(403).send("update error")
        } else {
            res.json(update.defaults);
        }
    });
});

module.exports = router;
/*{ Dark Soul Font similar stuff
    "url": "https://fonts.googleapis.com/css?family=Cormorant+S",
    "rule": "'Cormorant SC', serif",
    "family": "Cormorant SC",
    "category": "serif"
},*/