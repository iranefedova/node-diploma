const express = require('express');
const menu = require('../menu.json');
const app = module.exports = express();

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

function loadMenu() {
    dbConnect(function(db) {
        const collection = db.collection('menu');
        let food = {};
        for (let i = 0; i < menu.length; i++) {
            food = {
                title: menu[i].title,
                image: menu[i].image,
                price: menu[i].price
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
        });
        db.close();
    });
}

app.use(express.static(__dirname + '/public'));

app.post("/clients", function(req, res) {
    console.log('hello user');
    // dbConnect(function(db) {
    //     const collection = db.collection('clients');
    //     collection.find({email: req.body.email}).toArray(function(err, result) {
    //         if (err) {
    //             console.log(err);
    //         } else if (result.lenght == 0) {
    //             let newUser = {
    //                 name: req.body.name,
    //                 email: req.body.email,
    //                 balance: 100
    //             }
    //             collection.insert(newUser, function(err, result) {
    //                 if (err) {
    //                     console.log(err);
    //                     res.status(500).send('Database error');
    //                 } else {
    //                     console.log('New user');
    //                     res.status(200).send('Successfully add user');
    //                 }
    //             });
    //         } else {
    //             res.status(200).send(result);
    //         };
    //     });
    //     db.close();
    // });
    //     // let newUser = new User(users.length, req.body.name, req.body.score);
    //     // users.push(newUser);
    //     console.log(req.body.name);
    //     res.status(200).end('User was successfully added!');
});

app.get("/clients/:email", function(req, res) {

});

app.get("/order/:email", function(req, res) {

});

app.get("/menu", function(req, res) {
    getMenu((result, err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    });
});
