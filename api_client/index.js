const express = require('express');
const app = module.exports = express();

app.use(express.static(__dirname + '/public'));

app.post("/clients", function(req, res) {
        // let newUser = new User(users.length, req.body.name, req.body.score);
        // users.push(newUser);
        res.status(200).end('User was successfully added!');
});