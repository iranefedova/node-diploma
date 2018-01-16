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

module.exports = {
    getNewOrders,
    getCookingOrders,
    deleteOrders
};