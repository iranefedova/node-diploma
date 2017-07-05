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


describe('Kitchen test', () => {
    let socket;

    before((done) => {
        socket = io.connect(socketURL, options);
        socket.on('connect', function() {
            console.log('Connected...');
            socket.emit('enter kitchen');
        });
        done();
    });

    it("getting new orders",function(done){
        socket.on('get new orders', function (orders) {
            expect(orders instanceof Array).to.equal(true);
            done();
        });

    });
    it("getting cooking orders",function(done){
        socket.on('get cooking orders', function (orders) {
            expect(orders instanceof Array).to.equal(true);
            done();
        });

    });

});
