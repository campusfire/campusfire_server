process.env.NODE_ENV = 'prod';

//Define port
const logger = require('./logger.js')
const config = require('./config');
const http = require('./index.js')(logger)
const socket = require('socket.io')

var deploymentTaks=require('./deploymentTasks')
//Run the server using express
var server = http.listen(config.port, () => {
    //Generate 4 qr codes at the deployment of the app
    deploymentTaks.generateQRCodes()
    deploymentTaks.generateRegisterForQrCodes()
    console.log(`Server listening on port ${config.port}...`);
});

// var io = socket(server)
// io.on('connection', function(socket){
//     console.log('made socket connection')
//     socket.on('display', function(data){
//         io.sockets.emit('display', data)
//     })
// })


