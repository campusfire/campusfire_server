var socketio = require('socket.io')
const fs = require("fs");
const path = require("path");
module.exports.listen = function (app) {
    io = socketio.listen(app);
    // array of all lines drawn
    var line_history = [];

    // event-handler for new incoming connections

    io.on('connection', function (socket) {
        
        console.log("incoming socket connection");

        // first send the history to the new client
        for (var i in line_history) {
            socket.emit('draw_line', { line: line_history[i] } );
        }

        // add handler for message type "draw_line".
        socket.on('draw_line', function (data) {
            // add received line to history
            line_history.push(data.line);
            // send line to all clients
            io.emit('draw_line', { line: data.line });
        });

        // add handler to reset the drawing.
        socket.on('reset_line', function (data) {
            line_history = [];
            // send line to all clients
            io.emit('reset_line');
        });
    });

    return io;
};


