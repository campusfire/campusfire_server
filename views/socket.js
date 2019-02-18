const fs = require('fs')

// Make connection
var socket = io.connect()

var imagesList=[];
var display = document.getElementById('display')
fs.readdir('./uploads', (err, files) => {
    files.forEach(file => {
        console.log('ok')
        console.log(file)  
        imagesList.push(file)
    });
})

socket.emit('display', {
    images: imagesList
})

socket.on('display', function(data){
    for (var i=0; i<data.imagesList.length; i++){
        display.innerHTML += '<img src="/uploads/' + data.imagesList[i] + '"/>'
    }
})

// var socket = io();
// socket.on('chat message', function(msg){
//     console.log("bonjour socket")
// });
// $('form').submit(function(){
//     socket.emit('chat message', $('#m').val());
//     $('#m').val('');
//     return false;
// });

// socket.on('chat message', function(msg){
//     $('#messages').append($('<li>').text(msg));
// });