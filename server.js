//Define port
const logger = require('./logger.js')
const app = require('./index.js')(logger)
const PORT = 10410;
var deploymentTaks=require('./deploymentTasks')
//Run the server using express
app.listen(PORT, () => {
    //Generate 4 qr codes at the deployment of the app
    deploymentTaks.generateQRCodes()
    deploymentTaks.generateRegisterForQrCodes()
    console.log(`Server listening on port ${PORT}...`);
});