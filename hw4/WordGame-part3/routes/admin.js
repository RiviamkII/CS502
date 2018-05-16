var express = require('express');
var router = express.Router();
var users = require('./userService');
var bcrypt = require('bcrypt');

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
const saltRounds = 10;

function checkEmailAndPassword(email, password) {
    let emailRegeX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let passwordRegeX = /\d/;
    return (emailRegeX.test(email) && passwordRegeX.test(password) && email.length <= 320 && password.length >= 8);
}
/*******************************************************************************************
                                        Router part
 *******************************************************************************************/
router.all('/:userid*', function (req, res, next) {
    let csrfInRequest = req.header("csrf_Token");
    let csrfInSession = req.session.csrf_token;
    let authenticatedUser = req.session.user;
    let userid = req.params.userid;
    users.findById(userid, function (err, userInPath) {
        if(authenticatedUser && userInPath && authenticatedUser._id == userInPath._id && csrfInRequest == csrfInSession){
            if(userInPath.role === "ADMIN"){
                next();
            }
        }else{
            req.session.regenerate(function (err) {
                res.status(403).json("No permission. Maybe timeout or visit illegal or you are not the ADMIN.");
            });
        }
    })
});

router.get('/:userid/users', function (req, res, next) {
    users.findAll(function (err, allUsers) {
        if(err){
            res.status(403).send(err);
        }else{
            let usersInDB = [];
            for(let i in allUsers){
                allUsers[i] = allUsers[i].toObject();
                delete allUsers[i].password;
                usersInDB.push(allUsers[i]);
            }
            res.json(usersInDB);
        }
    })
});

router.post('/:userid/users/requirement', function (req, res, next) {
    let requirement = req.body;
    users.findByRequirement(requirement.req, function (err, usersResults) {
        if(err){
            res.json(err);
        }else{
            let usersresult = [];
            for(let i in usersResults){
                usersResults[i] = usersResults[i].toObject();
                delete usersResults[i].password;
                usersresult.push(usersResults[i]);
            }
            res.json(usersresult);
        }
    })
});

router.post('/:userid/user', function (req, res, next) {
    let createUser = req.body;
    let username = createUser.email;
    let password = createUser.password;
    if(!checkEmailAndPassword(username, password)){
        res.json({err: "username or password are invalid."});
        return;
    }
    if(username && password && createUser.role && createUser.enabled && createUser.name.firstName && createUser.name.lastName){
        users.findByEmail(createUser.email, function (err, userInDB) {
            if(userInDB){
                res.json({err: "That user has been existed."});
                return;
            }else{
                bcrypt.hash(createUser.password, saltRounds, function (err, hashedPassword) {
                    createUser.password = hashedPassword;
                    createUser.defaults = defaults;
                    users.create(createUser, function (err, newUser) {
                        if (err) {
                            res.json("err: create new user problem: " + err);
                        } else {
                            res.json("created successfully");
                        }
                    })
                });
            }
        })
    }else{
        res.json({err: "When creating a user, one of properties is missing."});
    }
});

router.put('/:userid/user', function (req, res, next) {
    let updateUser = req.body;
    let curAdminId = req.params.userid;
    if(updateUser._id && updateUser.name.firstName && updateUser.name.lastName && updateUser.email && updateUser.role && updateUser.enabled){
        if(curAdminId === updateUser._id){
            res.json({err :'You cannot change yourself!'});
            return;
        }else{
            users.updateUser(updateUser._id, updateUser, function (err, newUser) {
                if(err){
                    res.json(err);
                }else{
                    res.json("Update successfully");
                }
            })
        }
    }else{
        res.json({err: "When updating user, One of properties is missing."})
    }
});
module.exports = router;