const express = require('express');
const bodyParser = require('body-parser');
const api_client = require('./api_client');
const menu = require('./menu.json');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

// if (app.get('env') === 'development') {
//     app.use(express.errorHandler());
// }

app.use("/", api_client);

app.use('/libs/css', express.static(__dirname + '/public/libs/materialize/css/materialize.css'));
app.use('/libs/js', express.static(__dirname + '/public/libs/materialize/js/materialize.js'));

app.use('/angular', express.static(__dirname + '/node_modules/angular/angular.js'));
app.use('/angular-route', express.static(__dirname + '/node_modules/angular-route/angular-route.js'));
app.use('/angular-socket-io', express.static(__dirname + '/node_modules/angular-socket-io/socket.js'));
app.all('*', (req, res) => {
    res.status(404).send('Page not found');
});

app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(500).send({error: 'Something failed! Please try again'});
});

// Socket.io Communication
io.sockets.on('connect', require('./socket'));

server.listen(app.get('port'), () => {
    console.log('Server start at port ' + app.get('port') + '... Waiting for connections.');
});
