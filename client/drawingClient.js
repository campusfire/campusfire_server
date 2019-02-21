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
        var line = data.line;
        console.log(data.line);
        context.beginPath();
        context.moveTo(JSON.parse(line).pos_prev.x * width, JSON.parse(line).pos_prev.y * height);
        context.lineTo(JSON.parse(line).pos.x * width, JSON.parse(line).pos.y * height);
        context.stroke();
    });
});
