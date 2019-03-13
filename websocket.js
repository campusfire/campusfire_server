var socketio = require('socket.io')
const fs = require("fs");
const path = require("path");
module.exports.listen = function (app) {
    io = socketio.listen(app);
    // array of all lines drawn
    var line_history = [];

    // event-handler for new incoming connections

    io.on('connection', function (socket) {
        //------------------------------------------------------------//
        console.log("connected")
        socket.emit('refresh-msg', { wesh: 'whatever'});
        socket.on('refresh-msg', function (data) {
            console.log("wesh")
            var readStream = fs.createReadStream(path.resolve(__dirname, './uploads/image.jpg'),{
                encoding:'binary'
            }), chunks = [];

            var readStream2 = fs.createReadStream(path.resolve(__dirname, './uploads/image2.jpg'),{
                encoding:'binary'
            }), chunks2 = [];
            
            var readStream3 = fs.createReadStream(path.resolve(__dirname, './uploads/image3.jpg'),{
                encoding:'binary'
            }), chunks3 = [];

            var readStream4 = fs.createReadStream(path.resolve(__dirname, './uploads/image4.jpg'),{
                encoding:'binary'
            }), chunks4 = [];
            // readStream.on('readable', function(){
            //     console.log('Image loading');
            // })

            var readStreamQR = fs.createReadStream(path.resolve(__dirname, './qrCodes/qrCode1.png'),{
                encoding:'binary'
            }), chunksQR = [];

            var readStreamQR2 = fs.createReadStream(path.resolve(__dirname, './qrCodes/qrCode2.png'),{
                encoding:'binary'
            }), chunksQR2 = [];
            
            var readStreamQR3 = fs.createReadStream(path.resolve(__dirname, './qrCodes/qrCode3.png'),{
                encoding:'binary'
            }), chunksQR3 = [];

            var readStreamQR4 = fs.createReadStream(path.resolve(__dirname, './qrCodes/qrCode4.png'),{
                encoding:'binary'
            }), chunksQR4 = [];


            readStream.on('data', function(chunk){
                console.log('en cours')
                chunks.push(chunk);
                    socket.emit('img-chunk',chunk);
            })

            readStream2.on('data', function(chunk){
                console.log('en cours')
                chunks2.push(chunk);
                    socket.emit('img-chunk2',chunk);
            })

            readStream3.on('data', function(chunk){
                console.log('en cours')
                chunks3.push(chunk);
                    socket.emit('img-chunk3',chunk);
            })

            readStream4.on('data', function(chunk){
                console.log('en cours')
                chunks4.push(chunk);
                    socket.emit('img-chunk4',chunk);
            })

            readStreamQR.on('data', function(chunk){
                chunksQR.push(chunk);
                    socket.emit('QR-chunk',chunk);
            })

            readStreamQR2.on('data', function(chunk){
                chunksQR2.push(chunk);
                    socket.emit('QR-chunk2',chunk);
            })

            readStreamQR3.on('data', function(chunk){
                chunksQR3.push(chunk);
                    socket.emit('QR-chunk3',chunk);
            })

            readStreamQR4.on('data', function(chunk){
                chunksQR4.push(chunk);
                    socket.emit('QR-chunk4',chunk);
            })

            readStream.on('end', function(){
                console.log('Image 1 loaded');
            })

            readStream2.on('end', function(){
                console.log('Image 2 loaded');
            })

            readStream3.on('end', function(){
                console.log('Image 3 loaded');
            })

            readStream4.on('end', function(){
                console.log('Image 4 loaded');
            })

            readStreamQR.on('end', function(){
                console.log('QR 1 loaded');
            })

            readStreamQR2.on('end', function(){
                console.log('QR 2 loaded');
            })

            readStreamQR3.on('end', function(){
                console.log('QR 3 loaded');
            })

            readStreamQR4.on('end', function(){
                console.log('QR 4 loaded');
            })

        });
    //------------------------------------------------------------//
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


