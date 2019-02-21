const express = require('express');
const app = express();
const http = require("http").Server(app);
var io=require('socket.io')(http);

// get canvas element and create context
var canvas  = document.getElementById('drawing');
var context = canvas.getContext('2d');
var width   = window.innerWidth;
var height  = window.innerHeight;

// set canvas to full browser width/height
canvas.width = width;
canvas.height = height;

module.exports= {
    // array of all lines drawn
    var: line_history = [],

    // event-handler for new incoming connections
    eventHandler: function () {
        io.on('connection', function (socket) {

            // add handler for message type "draw_line".
            socket.on('draw_line', function (data) {
                var line = data.line;
                context.beginPath();
                context.moveTo(line[0].x * width, line[0].y * height);
                context.lineTo(line[1].x * width, line[1].y * height);
                context.stroke();
            })

            console.log("eventHandler launched")
        })
    }
};

