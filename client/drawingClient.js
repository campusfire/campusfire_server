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
        var pos_prev = JSON.parse(data.line).pos_prev;
        var pos = JSON.parse(data.line).pos;
        console.log("data.line", data.line);
        console.log("pos_prev",pos_prev);
        console.log("x de pos_prev",JSON.parse(pos_prev).x);
        context.beginPath();
        context.moveTo(JSON.parse(pos_prev).x * width, JSON.parse(pos_prev).y * height);
        context.lineTo(JSON.parse(pos).x * width, JSON.parse(pos).y * height);
        context.stroke();
    });
});
