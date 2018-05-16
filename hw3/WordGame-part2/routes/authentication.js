var express = require('express');
var router = express.Router();
var users = require('./userService');
var uuid = require('uuid');

/*router.post('/logout', function (req, res, next) {
   req.session.regenerate(function (err) {
       res.json({msg: 'success'});
   });
});*/

router.post('/logout', function (req, res, next) {
    req.session.destroy(function() {
        res.json({msg: 'success'});
    });
});

router.post('/login', function (req, res, next) {
   let username = req.body.username;
   let password = req.body.password;
   let emailRegeX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   let passwordRegeX = /\d/;
   if(!emailRegeX.test(username) || !passwordRegeX.test(password) || username.length > 320 || password.length < 8){
       res.json({error: 'Invalid username or password'});
       return;
   }
   req.session.regenerate(function (err) {
       users.findByEmail(username, function (err, userInDB) {
           if(userInDB && userInDB.password === password){
               req.session.user = userInDB;
               let csrfToken = uuid.v1();
               req.session.csrf_token = csrfToken;
               res.setHeader("csrf_Token", csrfToken);
               delete userInDB.password;
               res.json(userInDB);
           }else{
               res.status(403).send('Error with password or user is not existed');
           }
       })
   })
});

router.get('/user', function (req, res, next) {
   let curUser = req.session.user;
   if(curUser){
       users.findByID(curUser._id, function (err, userInDB) {
           req.session.user = userInDB;
           delete userInDB.password;
           res.json(userInDB);
       })
   }else{
       res.status(403).send('Forbidden')
   }
});

module.exports = router;