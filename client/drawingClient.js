document.addEventListener("DOMContentLoaded", function() {
    // get canvas element and create context
    var canvas  = document.getElementById('drawing');
    var context = canvas.getContext('2d');
    var width   = window.innerWidth;
    var height  = window.innerHeight;
    var socket  = io.connect();

    // set canvas to full browser width/height
    canvas.width = width;
    canvas.height = height;

    // draw line received from server
    socket.on('draw_line', function (data) {
        console.log("client received draw_line");
        console.log("data.line", data.line);
        console.log("pos_prev",data.line.pos_prev);
        console.log("x de pos_prev",data.line.pos_prev.x);
        context.beginPath();
        context.moveTo(data.line.pos_prev.x * width, data.line.pos_prev.y * height);
        context.lineTo(data.line.pos.x * width, data.line.pos.y * height);
        context.stroke();
    });

    // reset line received from server
    socket.on('reset_line', function (data) {
        console.log("reset drawing");
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

});
