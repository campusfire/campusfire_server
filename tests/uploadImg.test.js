process.env.NODE_ENV = 'env_test';

const request = require('supertest');
const config = require('../config');
const logger = require('../logger.js');
const app = require('../index.js')(logger);
const deploymentTaks=require('../deploymentTasks');
const fs = require('fs');

let server;
let authenticatedUser;

beforeAll(async () => {
    authenticatedUser = await request.agent(app);

    fs.appendFile('./tests/files/testImgText.txt', '', function (err) {
        if (err) throw err;
        console.log('Fichier au format volontairement mauvais créé');
    });

    server = await app.listen(config.port, () => {
        //Generate 4 qr codes at the deployment of the app
        deploymentTaks.generateQRCodes();
        deploymentTaks.generateRegisterForQrCodes();
        console.log(`Server listening on port ${config.port}...`);
    });
});

afterAll(async () => {
    fs.unlink('./tests/files/testImgText.txt', function (err) {
        if (err) throw err;
        console.log('Fichier au format volontairement mauvais supprimé');
    });

    await server.close();
    await console.log(`SERVER CLOSED`);
});

test('#POST Wrong format /file-upload', (done) => {
    authenticatedUser
        .post('/file-upload')
        .attach('Image', './tests/files/testImgText.txt')
        .end((err, response) => {
            expect(response.statusCode).toEqual(403);
            done(err);
        });



});

