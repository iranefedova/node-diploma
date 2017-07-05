const dbConn = require('./db');

function newUser(user, callback) {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('clients');
        collection.find({email: user.email}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else if (result.length === 0) {
                let newUser = {
                    name: user.name,
                    email: user.email,
                    balance: 100
                };
                collection.insert(newUser, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('New user');
                        callback(newUser);
                    }
                });
            } else {
                callback({
                    "name": result[0].name,
                    "email": result[0].email,
                    "balance": result[0].balance
                });
            };
            db.close();
        });
    });
}

function upBalance(email, callback) {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('clients');
        collection.updateOne({"email": email}, {'$inc': {"balance": 100}}, function (err, uResult) {
            if (err) {
                console.log(err);
            } else {
                collection.find({"email": email}).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                    }  else {
                        callback(result[0].balance);
                    };
                    db.close();
                });
            }
        });
    });
}

function downBalance(email, size, callback) {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('clients');
        collection.updateOne({"email": email}, {'$inc': {"balance": -size}}, function (err, uResult) {
            if (err) {
                console.log(err);
            } else {
                collection.find({"email": email}).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                    }  else {
                        callback(result[0].balance);
                    };
                    db.close();
                });
            }
        });
    });
}

function returnMoney(id, email, callback) {
    dbConn.dbConnect(function(db) {
        let collection = db.collection('orders');
        let client;
        let o_id = new dbConn.mongo.ObjectID(id);
        collection.find({"_id": o_id}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            }  else {
                client = result[0].email;
                console.log(result[0].food.price);
                collection = db.collection('clients');
                collection.updateOne({"email": client}, {'$inc': {"balance": result[0].food.price}}, function (err, uResult) {
                    if (err) {
                        console.log(err);
                    } else {
                        collection.find({"email": email}).toArray(function(err, result) {
                            if (err) {
                                console.log(err);
                            }  else {
                                callback(result[0].balance);
                            };
                            db.close();
                        });
                    }
                });
            };
        });
    });
}

module.exports = {
    newUser,
    upBalance,
    downBalance,
    returnMoney
};