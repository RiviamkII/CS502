var User = require('./userModel');

function create(newUser, cb) {
    new User(newUser).save(cb);
}
module.exports.create = create;

function findById(id, cb) {
    User.findById(id, cb);
}
module.exports.findById = findById;

function findAll(cb){
    User.find({}).sort({role:"ascending"}).exec(cb);
}
module.exports.findAll = findAll;

function findByEmail(email, cb){
    User.findOne({email: email},cb);
}
module.exports.findByEmail = findByEmail;

function updateUserDefault(id, defaults, cb) {
    User.update({'_id':id}, {$set:{defaults: defaults}}, function (err, updateResult) {
        findById(id, cb);
    })
}
module.exports.updateUserDefault = updateUserDefault;

function updateUser(id, newUser, cb) {
    User.update({'_id':id}, newUser, function (err, updateResult) {
        findById(id, cb);
    })
}
module.exports.updateUser = updateUser;

function findByRequirement(requirement, cb) {
    let require = requirement;
    let name = new RegExp(".*" + require + ".*", "i");
    User.find({$or: [{"email": require},
                    {
                        $or: [{"name.firstName": {$regex: name}}, {"name.lastName": {$regex: name}}
                        ]
                    }
                ]
    }).sort({role: "ascending"}).exec(cb);
}
module.exports.findByRequirement = findByRequirement;
