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
    socket.emit('send:name', {
        name: 'Bob'
    });

    socket.on('new user', function(useremail) {
        dbConnect(function(db) {
            const collection = db.collection('clients');
            collection.find({email: useremail}).toArray(function(err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length === 0) {
                    console.log('no find');
                    let newUser = {
                        // name: data.name,
                        email: user_email,
                        balance: 100
                    };
                    collection.insert(newUser, function(err, result) {
                        if (err) {
                            console.log(err);
                            // res.status(500).send('Database error');
                        } else {
                            console.log('New user');
                            socket.emit('user login', {
                                user: newUser
                            });
                            // res.status(200).send('Successfully add user');
                        }
                    });
                } else {
                    console.log(result[0].name);
                    socket.emit('user login',  result[0].email, result[0].name, result[0].balance);
                };
                db.close();
            });
        });
    });

    setInterval(function () {
        socket.emit('send:time', {
            time: (new Date()).toString()
        });
    }, 1000);
};