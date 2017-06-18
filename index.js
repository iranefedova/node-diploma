const express = require('express');
const bodyParser = require('body-parser');
const api_client = require('./api_client');
const api_kitchen = require('./api_kitchen');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

app.use("/", api_client);
app.use("/kitchen", api_kitchen);
app.use('/libs/css', express.static(__dirname + '/libs/materialize/css/materialize.css'));
app.use('/libs/js', express.static(__dirname + '/libs/materialize/js/materialize.js'));

app.all('*', (req, res) => {
    res.send('Invalid format');
});

app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(500).send({error: 'Something failed! Please try again'});
});


app.listen(3000, () => {
    console.log('Server start... Waiting for connections.');
});
