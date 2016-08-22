var util = require('util'),
    Db          = require('mongodb').Db,
    DbServer    = require('mongodb').Server,
    MongoClient = require('mongodb').MongoClient,
    ObjectId    = require('mongodb').ObjectId,
    dbPort      = 27017,
    dbHost      = 'localhost',
    dbName      = 'datadb',
    dbUrl       = "mongodb://" + dbHost + ":" + dbPort + "/" + dbName;

//FIXME Important do not return password from DB layer ever!!!!
//FIXME Encrypt all passwords
exports.mongoStoreOptions = {
    url: dbUrl
};

exports.autoLogin = function(user, callback){

    MongoClient.connect(dbUrl, function(err, db) {
        if(err) { console.log("We are not connected"); return; }
        var people = db.collection('people');
        if (people){
            people.findOne({user:user}, function(err, person) {
                if (person == null){
                    callback('user-not-found');
                }  else {
                    callback(null, person);
                }
                db.close();
            });
        } else {
            callback('db error');
            db.close();
        }
    });
};

exports.manualLogin = function(user, pass, callback){

    MongoClient.connect(dbUrl, function(err, db) {
        if(err) { console.log("We are not connected"); return; }
        var people = db.collection('people');
        if (people){
            people.findOne({user:user}, function(err, person) {
                if (person == null){
                    callback('user-not-found');
                }  else {
                    //better checking/hashing!
                    if(pass == person.pass) {
                        callback(null, person);
                    } else {
                        callback('invalid-password');
                    }
                }
                db.close();
            });
        } else {
            callback('db error');
            db.close();
        }
    });
};

exports.addNewAccount = function(newData, callback){

    MongoClient.connect(dbUrl, function(err, db) {
        if(err) { console.log('We are not connected'); return; }

        var people = db.collection('people');

        people.findOne({user:newData.user}, function(err, person) {
            if (person){
                callback('username-taken');
            } else {
                people.findOne({email:newData.email}, function(err, person) {
                    if (err) {
                        callback(err);
                    } else if (person){
                        callback('email-taken');
                    } else {
                        console.log(person);
                        // append date stamp when record was created
                        newData.date = Date.now();
                        newData.score = 0;
                        people.insert(newData, {safe: true}, callback);
                    }
                });
            }
        });
    });
};

exports.getAllScores = function(callback){

    MongoClient.connect(dbUrl, function(err, db) {
        if(err) { console.log('We are not connected'); return; }

        var people = db.collection('people');

        people.find().toArray(function(err, res) {
            if (err) {
                callback(err);
            } else {
                //callback(null, res);
                var scores = [];
                for (var i = 0; i < res.length; i++) {
                    scores.push({
                        user: res[i].user,
                        score: res[i].score
                    });
                }
                scores = scores.sort(function (a, b) {
                    if (a.score > b.score) {
                        return 1;
                    }
                    if (a.score < b.score) {
                        return -1;
                    }
                    // a must be equal to b
                    return 0;
                });

                callback(null, scores);
            }
        });
    });

};

exports.setPlayerScore = function(userId, incScore){
    MongoClient.connect(dbUrl, function(err, db) {
        if(err) { console.log('We are not connected'); return; }
        var people = db.collection('people');
        /*
        * FIXME Save score for each game then total is taken from all combined
        *
        */
        if (people){
            people.updateOne({'_id': ObjectId(userId)}, {
                $inc: {'score': incScore}
            }, {}, function(err, results){
                console.log('player score updated', userId, incScore, results);
                db.close();
            });
        } else {
            db.close();
        }
    });
};

// exports.updateAccount = function(newData, callback)
// {
//     accounts.findOne({user:newData.user}, function(e, o){
//         o.name      = newData.name;
//         o.email     = newData.email;
//         o.country   = newData.country;
//         if (newData.pass == ''){
//             accounts.save(o, {safe: true}, function(err) {
//                 if (err) callback(err);
//                 else callback(null, o);
//             });
//         }   else{
//             saltAndHash(newData.pass, function(hash){
//                 o.pass = hash;
//                 accounts.save(o, {safe: true}, function(err) {
//                     if (err) callback(err);
//                     else callback(null, o);
//                 });
//             });
//         }
//     });
// }
