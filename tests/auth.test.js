process.env.NODE_ENV = 'env_test';

const request = require('supertest');
const config = require('../config');
const logger = require('../logger.js');
const app = require('../index.js')(logger);
const deploymentTaks=require('../deploymentTasks');
const fs = require('fs');

let server;
let unauthUser;

beforeAll(async () => {
    unauthUser = await request.agent(app);

    fs.appendFile(config.qrRegister, '', function (err) {
        if (err) throw err;
        console.log('Fake QR Register updated', config.qrRegister);
    });

    server = await app.listen(config.port, () => {
        //Generate 4 qr codes at the deployment of the app
        deploymentTaks.generateQRCodes();
        deploymentTaks.generateRegisterForQrCodes();
        console.log(`Server listening on port ${config.port}...`);
    });
});

afterAll(async () => {

    await server.close();
    await console.log(`SERVER CLOSED`);
});

describe('Test bad code for authentication', () => {
    test('#POST /authenticationPlayer1', (done) => {
        return unauthUser
            .post('/authenticationPlayer1')
            .send({barcodeSent:'wrongBarcode'})
            .expect(401,done);
    });
});

describe('Test good code for authentication', () => {
    test('#POST /authenticationPlayer1', (done) => {
        return unauthUser
            .post('/authenticationPlayer1')
            .send({barcodeSent:'CodeJoueur1'})
            .expect(200,done);
    });
});



