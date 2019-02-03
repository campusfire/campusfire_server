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

    fs.appendFile(config.textFile, '', function (err) {
        if (err) throw err;
        console.log('Fichier text de test créé', config.textFile);
    });

    server = await app.listen(config.port, () => {
        //Generate 4 qr codes at the deployment of the app
        deploymentTaks.generateQRCodes();
        deploymentTaks.generateRegisterForQrCodes();
        console.log(`Server listening on port ${config.port}...`);
    });
});

afterAll(async () => {
    fs.unlink(config.textFile, function (err) {
        if (err) throw err;
        console.log('Fichier text de test supprimé', config.textFile);
    });

    await server.close();
    await console.log(`SERVER CLOSED`);
});

test('#GET /postedText', (done) => {
    return authenticatedUser
        .get('/postedText')
        .expect(200, done);
});

test('#POST /postText', (done) => {
    authenticatedUser
        .post('/postText')
        .send({sentText:'ligne test'})
        .end((err, response) => {
            expect(response.statusCode).toEqual(200);
            expect(fs.existsSync(config.textFile)).toEqual(true);
            done(err);
        });



});
