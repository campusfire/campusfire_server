
module.exports= {
    // array of all lines drawn
    var: line_history = [],

    // event-handler for new incoming connections
    eventHandler: function () {
        io.on('connection', function (socket) {

            // first send the history to the new client
            for (var i in line_history) {
                socket.emit('draw_line', {line: line_history[i]});
            }

            // add handler for message type "draw_line".
            socket.on('draw_line', function (data) {
                // add received line to history
                line_history.push(data.line);
                // send line to all clients
                io.emit('draw_line', {line: data.line});
            });
        })
    }
};

