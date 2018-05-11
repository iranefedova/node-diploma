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
        socket.on('user test', function () {
            socket.emit('load account');
        });
        done();
    });

    describe('user account test', () => {
        it("check account username",function(done){
            socket.on('user login', function (clientEmail, clientName, clientBalance) {
                expect(clientName).to.equal('Petya');
                done();
            });
        });
        it("check account email",function(done){
            socket.on('user login', function (clientEmail, clientName, clientBalance) {
                expect(clientEmail).to.equal('petya@mail.ru');
                done();
            });
        });
        it("check account balance",function(done){
            socket.on('user login', function (clientEmail, clientName, clientBalance) {
                expect(clientBalance).to.equal(100);
                done();
            });
        });
        it("check balance increase",function(done){
            socket.emit('up balance');
            socket.on('balance change', function (size) {
                expect(size).to.equal(200);
                done();
            });
        });
    });

    describe('user orders test', () => {
        let orderSize;
        let orderId;

        before((done) => {
            socket.emit('get orders');
            socket.on('user orders', function (orders) {
                orderSize = orders.length;
            });
            done();
        });

        it("check addition of order",function(done){
            socket.emit('add order',
                {
                    "title" : "Cheese Popovers",
                    "image" : "https://spoonacular.com/recipeImages/Cheese-Popovers-517616.jpg",
                    "price" : 27,
                    "id" : 517616
                });
            socket.emit('get orders');
            socket.on('new order', function (id) {
                orderId = id;
            });
            socket.on('user orders', function (orders) {
                expect(orders.length).to.equal(orderSize + 1);
                done();
            });

        });
        it("check balance change after order",function(done){

            socket.emit('load account');
            socket.on('user login', function (clientEmail, clientName, clientBalance) {
                expect(clientBalance).to.equal(200 - 27);
                done();
            });

        });
        it("check order deletion",function(done){

            socket.emit('delete order', orderId);
            socket.emit('get orders');
            socket.on('user orders', function (orders) {
                expect(orders.length).to.equal(orderSize);
                done();
            });

        });
    });
});
