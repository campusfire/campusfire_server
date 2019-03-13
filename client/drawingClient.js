document.addEventListener("DOMContentLoaded", function() {
    // get canvas element and create context
    var canvas  = document.getElementById('drawing');
    var context = canvas.getContext('2d');
    //var winWidth   = window.innerWidth;
    var winHeight  = window.innerHeight;
    var socket  = io.connect();

    // set canvas width/height
    canvas.height = (4/5)*winHeight;
    canvas.width = (750/1334)*canvas.height;
    var width = canvas.width;
    var height = canvas.height;
    //canvas.style.backgroundImage = "url('../images/smartphone-screen.png')";

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
