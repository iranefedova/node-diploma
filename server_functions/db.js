const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://heroku_hrrv8wz0:Adventure13Time@ds143892.mlab.com:43892/heroku_hrrv8wz0';

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

module.exports = {
    dbConnect,
    mongo
};
