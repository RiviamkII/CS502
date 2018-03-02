var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var fs = require('fs');

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
}, {"url":"https://fonts.googleapis.com/css?family=Cabin%20Sketch",
    "rule":"'Cabin Sketch', Display",
    "family":"Cabin Sketch",
    "category":"Display"
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
},  {
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
  "font" : {
      "url" : "https://fonts.googleapis.com/css?family=Acme",
      "rule": "'Acme', Sans Serif",
      "family": "Acme",
      "category": "Sans Serif"
  },
  "color" : {guessBG: "#ffffff", wordBG: "#aaaaaa", textBG: "#000000"},
  "level" : {"name": "Medium", "minLength": 4, "maxLength": 10, "guess":7}
};

function getWordList() {
    var words = [];
    var ws = new Array();
    fs.readFile('public/file/wordlist.txt',"UTF-8",function (err,data) {
        if(err){
            return console.error(err);
        }
        targets = data.replace(/\n/g, " ").split(" ");
    });
}

function getFont(fontFamily) {
    for (var i = 0; i < fonts.length; i++) {
        if (fonts[i].family === fontFamily) {
            return fonts[i];
        }
    }
}

function changeGameView(view, target, guess) {
    view = view.split("");
    for(var i = 0 ;i< guess.length; i++){
        for(var j = 0 ;j< target.length; j++){
            if(target.charAt(j) == guess.charAt(i).toUpperCase()){
                view[j]=(guess.toUpperCase().charAt(i));
            }
        }
    }
    return view.join("");
}


function checkIfSuccess(guess, target){
    for(var i =0 ;i< target.length; i++){
        var num = guess.toUpperCase().indexOf(target.toUpperCase().charAt(i));
        if(num < 0){
            return false;
        }
    }
    return true;
}

function selectTarget(level) {
    var minLength = level.minLength;
    var maxLength = level.maxLength;
    var index;
    while(true){
        index = Math.floor(Math.random() * targets.length);
        if(targets[index].length >= minLength && targets[index].length <= maxLength){
            return targets[index];
        }
    }
}
/*****************************ROUTES**********************************/
router.get('/wordgame', function(req, res, next) {
    getWordList() ;
    res.sendFile( 'index.html', { root : __dirname + "/../public" } );
});

router.get('/wordgame/api/v1/meta', function(req, res, next){
    res.json({
        "levels": levels,
        "fonts": fonts,
        "defaults": defaults
    });
});

router.get('/wordgame/api/v1/meta/fonts', function(req, res, next){
    res.send(fonts);
});

router.get('/wordgame/api/v1/sid', function (req, res, next) {
    var sid = uuid();
    games[sid] = [];
    res.setHeader('X-sid', sid);
    res.send();
});

router.post('/wordgame/api/v1/:sid', function (req, res, next) {
    var font = getFont(req.headers["x-font"]);
    var level = levels[req.query.level];
    // console.log("router.post", level);
    var colors = req.body;
    var sid = req.params.sid;
    var temp = games[sid];
    var view = "";
    if (!sid) {
        res.send({msg: "sid is null"});
        return;
    }
    var target = selectTarget(level).toUpperCase();
    for(var i =0;i< target.length;i++){
        view += "_";
    }
    var curGame ={
        font: font,
        level: level,
        colors: colors,
        gid: uuid(),
        remaining: level.guesses,
        status: "Unfinished",
        guess:"",
        timeStamp: new Date().getTime(),
        target: target,
        view: view
    };
    temp[curGame.gid] = curGame;
    var tempTarget = curGame.target;
    delete curGame.target;
    res.json(curGame);
    curGame.target = tempTarget;
});

router.get('/wordgame/api/v1/:sid/:gid', function(req , res , next){
    var tempGames = games[req.params.sid] || {error : "No user"};
    var tempGame = tempGames[req.params.gid] || {error : "No game"};
    var target = tempGame.target;
    if( tempGame.status === "Unfinished"){
        delete tempGame.target;
    }
    res.send(tempGame);
    tempGame.target = target;
});

router.get('/wordgame/api/v1/:sid', function(req , res , next){
    var result = games[req.params.sid];
    if(result){
        var targets = {};
        var sum = [];
        for(var key in result){
            targets[key] = result[key].target;
            if(result[key].status === "Unfinished"){
                delete result[key].target;
            }
        }
        for(var key in result){
            sum.push(result[key]);
        }
        res.send(sum);
        for(var key in targets){
            result[key].target = targets[key];
        }
    }else{
        res.send({error : 'No user'});
    }
});

router.post('/wordgame/api/v1/:sid/:gid/guesses', function (req, res, next) {
    var tempGames = games[req.params.sid] || {error : "No user"};
    var tempGame = tempGames[req.params.gid] || {error : "No game"};
    var guessWord = req.query.guess;
    var record;
    if(tempGame.guess.indexOf(guessWord) >= 0){
        res.json({error: "Have guessed already"});
        return;
    }
    tempGame.guess += guessWord;
    if(tempGame.remaining < 0 || tempGame.status === "WIN" || tempGame.status ==="LOSE"){
        record = {error: "This game has already done"};
    }
    if(tempGame.target.indexOf(guessWord.toUpperCase()) < 0){
        tempGame.remaining--;
    }
    tempGame.view = changeGameView(tempGame.view, tempGame.target, tempGame.guess);
    if(tempGame.remaining === 0 || checkIfSuccess(tempGame.guess, tempGame.target)){
        tempGame.timeToComplete = new Date().getTime() - tempGame.timestamp;
        if(checkIfSuccess(tempGame.guess, tempGame.target)){
            tempGame.status = "WIN";
        }else {
            tempGame.status = "LOSE";
        }
    }
    if(record){
        res.json(record);
    }else{
        var tempTarget = tempGame.target;
        if(tempGame.status === "Unfinished"){
            delete tempGame.target;
        }
        res.json(tempGame);
        tempGame.target = tempTarget;
    }

});
module.exports = router;
