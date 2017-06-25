const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017/droncafe';

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
    // socket.emit('send:name', {
    //     name: 'Bob'
    // });

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
                            console.log(newUser.balance);
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
    })

    setInterval(function () {
        socket.emit('send:time', {
            time: (new Date()).toString()
        });
    }, 1000);
};