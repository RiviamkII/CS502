var Words = require('./wordModel');

function create(words, cb) {
    console.log("before create wordlist: ", words);
    Words.create({}, function (err, resultList) {
        words.forEach(function (word) {
            resultList.wordList.push(word);
        });
        //resultList.wordList.push(words);
        resultList.save(function (err, savedlist) {
            console.log("savedlist: ", savedlist);
            cb(err, savedlist);
        })
    })
    /*new Words(words).save(function (err, resultWords) {
        if(err){
            return {msg: "err: " + err};
        }else{
            console.log("after create wordlist: ",resultWords);
            cb(err, resultWords);
        }
     });*/
}
module.exports.create = create;

function findAll(cb) {
    Words.find({}, cb);
}
module.exports.findAll = findAll;