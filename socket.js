const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017/droncafe';
const drone = require('netology-fake-drone-api');

function dbConnect(callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Ошибка подключения к серверу MobgoDB!');
            res.status(500).send('Ошибка сервера базы данных.');
        } else {
            console.log('Подключено к', url);
            callback(db);
        }
    });
}

module.exports = function (socket) {

    socket.on('new user', function(username, useremail) {
        socket.email = useremail;
        dbConnect(function(db) {
            const collection = db.collection('clients');
            collection.find({email: useremail}).toArray(function(err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length === 0) {
                    let newUser = {
                        name: username,
                        email: useremail,
                        balance: 100
                    };
                    collection.insert(newUser, function(err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('New user');
                            socket.emit('user login', newUser.email, newUser.name, newUser.balance);
                        }
                    });
                } else {
                    socket.emit('user login',  result[0].email, result[0].name, result[0].balance);
                };
                db.close();
            });
        });
    });
    

    socket.on('up balance', function () {
        dbConnect(function(db) {
            const collection = db.collection('clients');
            collection.updateOne({"email": socket.email}, {'$inc': {balance: 100}}, function (err, uResult) {
                if (err) {
                    console.log(err);
                } else {
                    collection.find({"email": socket.email}).toArray(function(err, result) {
                        if (err) {
                            console.log(err);
                        }  else {
                            socket.emit('balance change', result[0].balance);
                        };
                        db.close();
                    });
                }
            });
        });
    });

    socket.on('down balance', function (size) {
        dbConnect(function(db) {
            const collection = db.collection('clients');
            collection.updateOne({"email": socket.email}, {'$inc': {balance: -size}}, function (err, uResult) {
                if (err) {
                    console.log(err);
                } else {
                    collection.find({"email": socket.email}).toArray(function(err, result) {
                        if (err) {
                            console.log(err);
                        }  else {
                            socket.emit('balance change', result[0].balance);
                        };
                        db.close();
                    });
                }
            });
        });
    });

    socket.on('get orders', function () {
        dbConnect(function(db) {
            const collection = db.collection('orders');
            collection.find({email: socket.email}).toArray(function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    socket.emit('user orders',  result);
                };
                db.close();
            });
        });
    });
    
    socket.on('add order', function (foodTitle, foodImg) {
        dbConnect(function(db) {
            const collection = db.collection('orders');
            let newOrder = {
                title: foodTitle,
                image: foodImg,
                email: socket.email,
                status: 'Заказано',
                socket: socket.id
            };
            collection.insert(newOrder, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('New order');
                    socket.emit('new order', result.ops[0]);
                    socket.broadcast.to('kitchen').emit('to kitchen', result.ops[0]);
                }
            });
            db.close();
        });
    });

    socket.on('delete order', function (id) {
        dbConnect(function(db) {
            const collection = db.collection('orders');
            let o_id = new mongo.ObjectID(id);
            collection.deleteOne({_id: o_id}, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    socket.emit('order deleted', id);
                }
            });
        });
    });
    
    socket.on('enter kitchen', function () {
        socket.room = 'kitchen';
        socket.join('kitchen');

        getNewOrders((result) => {
            socket.emit('get new orders',  result);
        });

        getCookingOrders((result) => {
            socket.emit('get cooking orders',  result);
        });

    });
    
    socket.on('start cook', function (id) {
        let status = 'Готовится';
        updateStatus(id, status, (res) => {
            getNewOrders((result) => {
                socket.emit('get new orders',  result);
            });

            getCookingOrders((result) => {
                socket.emit('get cooking orders',  result);
            });

            socket.to(res.socket).emit('status change', id, status);
        });
    });
    
    socket.on('finish cook', function (id) {
        let status = 'Доставляется';

        updateStatus(id, status, (res) => {

            getCookingOrders((result) => {
                socket.emit('get cooking orders',  result);
            });

            socket.to(res.socket).emit('status change', id, status);
            delieverFood(res.email, res.title, (delieverStatus) => {
                updateStatus(id, delieverStatus, (res) => {

                    socket.to(res.socket).emit('status change', id, delieverStatus);

                });
            });
        });
    });

};

function updateStatus (id, status, callback) {
    dbConnect(function(db) {
        const collection = db.collection('orders');
        let o_id = new mongo.ObjectID(id);
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

function getNewOrders(callback) {
    dbConnect(function(db) {
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
    dbConnect(function(db) {
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

function delieverFood(userEmail, foodTitle, callback) {
    let client = {};
    let food = {};
    dbConnect(function(db) {
        let collection = db.collection('clients');
        collection.find({email: userEmail}).toArray(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                client = result[0];
                console.log(client);
                collection = db.collection('menu');
                collection.find({title: foodTitle}).toArray(function(err, result) {
                    if (err) {
                    } else {
                        food = result[0];
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
                });
            };
            db.close();
        });
    });
}