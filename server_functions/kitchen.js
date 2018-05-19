const dbConn = require('./db');

function getNewOrders(callback) {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('orders');
        collection.find({status: 'Заказано'}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback(result);
            };
            db.close();
        });
    });
}

function getCookingOrders(callback) {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('orders');
        collection.find({status: 'Готовится'}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback(result);
            };
            db.close();
        });
    });
}

function deleteOrders(email, callback) {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('orders');
        collection.deleteMany({"email": email}, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(`client ${email} disconnected`);
                callback();
            }
            db.close();
        });
    });
}

function newCook(user, callback) {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('chefs');
        collection.find({id: user.id}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else if (result.length === 0) {
                let newCook = {
                    id: user.id
                };
                collection.insert(newCook, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('New cook');
                        callback(newCook);
                    }
                });
            };
            db.close();
        });
    });
}

module.exports = {
    getNewOrders,
    getCookingOrders,
    deleteOrders,
    newCook
};
