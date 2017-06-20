const express = require('express');
const menu = require('../menu.json');
const app = module.exports = express();

app.use(express.static(__dirname + '/public'));

app.post("/clients", function(req, res) {
        // let newUser = new User(users.length, req.body.name, req.body.score);
        // users.push(newUser);
        console.log(req.body.name);
        res.status(200).end('User was successfully added!');
});

app.get("/clients/:email", function(req, res) {

});

app.get("/order/:email", function(req, res) {

});

app.get("/menu", function(req, res) {
    res.status(200).send(menu);
});
