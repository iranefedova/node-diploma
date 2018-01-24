const users = require('./server_functions/users');
const orders = require('./server_functions/orders');
const kitchen = require('./server_functions/kitchen');

module.exports = function (socket) {
    let clientName;
    let clientEmail;
    let clietnBalance;

    socket.on('new user', function(username, useremail) {
        socket.email = useremail;
        users.newUser({"name": username, "email": useremail}, (newUser) => {
            clientName = newUser.name;
            clientEmail = newUser.email;
            clietnBalance = newUser.balance;
        });
    });

    socket.on('load account', function () {
        socket.emit('user login', clientEmail, clientName, clietnBalance);
    });


    socket.on('up balance', function () {
        users.upBalance(socket.email, (balance) => {
            socket.emit('balance change', balance);
        });
    });

    socket.on('down balance', function (size) {
        users.downBalance(socket.email, size, (balance) => {
            socket.emit('balance change', balance);
        });
    });

    socket.on('return money', function (id) {
        users.returnMoney(id, socket.email, (balance) => {
            socket.emit('balance change', balance);
        });
    });

    socket.on('get orders', function () {
        orders.getOrders(socket.email, (result) => {
            socket.emit('user orders',  result);
        });
    });

    socket.on('add order', function (food, table) {
        orders.addOrder(socket.email, food, table, socket.id, (result) => {
            socket.emit('new order', result.id);
            socket.broadcast.to('kitchen').emit('to kitchen', result.order);
        });
    });

    socket.on('delete order', function (id) {
        orders.deleteOrder(id, () => {
            socket.emit('order deleted', id);
        });
    });

    socket.on('enter kitchen', function () {
        socket.room = 'kitchen';
        socket.join('kitchen');

        kitchen.getNewOrders((result) => {
            socket.emit('get new orders',  result);
        });

        kitchen.getCookingOrders((result) => {
            socket.emit('get cooking orders',  result);
        });

    });

    socket.on('start cook', function (id) {
        let status = 'Готовится';
        orders.updateStatus(id, status, (res) => {
            kitchen.getNewOrders((result) => {
                socket.emit('get new orders',  result);
            });

            kitchen.getCookingOrders((result) => {
                socket.emit('get cooking orders',  result);
            });

            socket.to(res.socket).emit('status change', id, status);
        });
    });

    socket.on('finish cook', function (id) {
        let status = 'Доставляется';
        orders.updateStatus(id, status, (res) => {
            kitchen.getCookingOrders((result) => {
                socket.emit('get cooking orders',  result);
            });

            socket.to(res.socket).emit('status change', id, status);
            orders.deliverFood(res.email, res.food, (deliverStatus) => {
                orders.updateStatus(id, deliverStatus, (res) => {
                    socket.to(res.socket).emit('status change', id, deliverStatus);
                });
            });
        });
    });

    socket.on('disconnect', function () {
        kitchen.deleteOrders(socket.email, (result) => {
            kitchen.getNewOrders((result) => {
                socket.broadcast.to('kitchen').emit('get new orders', result);
            });

            kitchen.getCookingOrders((result) => {
                socket.broadcast.to('kitchen').emit('get cooking orders', result);
            });
        });
    });

};
