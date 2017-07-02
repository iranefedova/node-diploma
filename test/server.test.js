const expect = require('chai').expect;
const PORT = process.env.PORT || 3000;
const io = require('socket.io-client');
const socketURL = 'http://localhost:' + PORT;
options ={
    transports: ['websocket'],
    'force new connection': true,
    'reconnection delay' : 0,
    'reopen delay' : 0
};


describe('Clients test', () => {
    let socket;

    beforeEach((done) => {
        socket = io.connect(socketURL, options);
        socket.on('connect', function() {
            console.log('Connected...');
            socket.emit('new user', 'Petya', 'petya@mail.ru');
        });
        socket.on('hello user', function () {
            socket.emit('load account');
        });
        done();
    });

    describe('create user', () => {
        it("check username",function(done){
            socket.on('user login', function (clientEmail, clientName, clietnBalance) {
                expect(clientName).to.equal('Petya');
                done();
            });
        });
        it("check email",function(done){
            socket.on('user login', function (clientEmail, clientName, clietnBalance) {
                expect(clientEmail).to.equal('petya@mail.ru');
                done();
            });
        });
        it("check balance",function(done){
            socket.on('user login', function (clientEmail, clientName, clietnBalance) {
                expect(clietnBalance).to.equal(100);
                done();
            });
        });
    });
});
