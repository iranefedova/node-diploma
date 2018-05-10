const dbConn = require('./db');
const drone = require('netology-fake-drone-api');

function getOrders(email, callback) {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('orders');
        collection.find({"email": email}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback(result);
            };
            db.close();
        });
    });
}

function addOrder(email, food, table, socketID, callback) {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('orders');
        let newOrder = {
            food: food,
            table: table,
            email: email,
            status: 'Заказано',
            socket: socketID
        };
        collection.insert(newOrder, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('New order');
                callback({
                    "id": result.ops[0]._id,
                    "order": result.ops[0]
                });
            }
        });
        db.close();
    });
}

function deleteOrder(id, callback) {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('orders');
        let o_id = new dbConn.mongo.ObjectID(id);
        collection.deleteOne({_id: o_id}, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                callback();
            }
        });
    });
}

function updateStatus (id, status, callback) {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('orders');
        let o_id = new dbConn.mongo.ObjectID(id);
        collection.updateOne({"_id": o_id}, {'$set': {status: status}}, function (err, uResult) {
            if (err) {
                console.log(err);
            } else {
                collection.find({"_id": o_id}).toArray(function(err, result) {
                    if (err) {
                        console.log(err);
                    }  else {
                        callback(result[0]);
                    };
                    db.close();
                });
            }
        });
    });
}

function deliverFood(userEmail, food, callback) {
    let client = {};
    dbConn.dbConnect(function(db) {
        let collection = db.collection('clients');
        collection.find({email: userEmail}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                client = result[0];
                drone.deliver(client, food)
                    .then(
                        result => {
                            callback('Подано');
                        },
                        error => {
                            callback('Возникли сложности');
                        }
                    );
            };
            db.close();
        });
    });
}

module.exports = {
    getOrders,
    addOrder,
    deleteOrder,
    updateStatus,
    deliverFood
};
