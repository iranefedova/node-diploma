const express = require('express');
const menu = require('../menu.json');
const app = module.exports = express();
const dbConn = require('../server_functions/db');

function loadMenu() {
    dbConn.dbConnect(function(db) {
        const collection = db.collection('menu');
        let food = {};
        for (let i = 0; i < menu.length; i++) {
            food = {
                title: menu[i].title,
                image: menu[i].image,
                price: menu[i].price,
                ingredients: menu[i].ingredients,
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
    dbConn.dbConnect(function(db) {
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
    // loadMenu();
    getMenu((result, err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    });
});
