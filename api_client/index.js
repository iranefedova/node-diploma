const express = require('express');
const menu = require('../menu.json');
const app = module.exports = express();

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://heroku_hrrv8wz0:q2k2j2k5hk88b0djtvv6bg3nsm@ds143892.mlab.com:43892/heroku_hrrv8wz0';


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

function loadMenu() {
    dbConnect(function(db) {
        const collection = db.collection('menu');
        let food = {};
        for (let i = 0; i < menu.length; i++) {
            food = {
                title: menu[i].title,
                image: menu[i].image,
                price: menu[i].price,
                id: menu[i].id
            };
            collection.insert(food, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Блюдо ${i+1} загружено`);
                }
            });
        }
        db.close();
    });
}

function getMenu(callback) {
    dbConnect(function(db) {
        const collection = db.collection('menu');
        collection.find({}, {_id: 0}).toArray(function(err, result) {
            if (err) {
                console.log(err);
                callback({}, 'Find error');
            } else {
                callback(result, '');
            };
            db.close();
        });
    });
}

app.use(express.static(__dirname + '/public'));

app.get("/menu", function(req, res) {
    loadMenu();
    getMenu((result, err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    });
});
