const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const reload = require("reload");
const http = require("http").Server(app);
const qrcode=require("qrcode-generator");
const request=require("request");
const config = require('./config');
const fct = require('./getOldestFileName');
const _=require("underscore");

var io=require('socket.io')(http);

//Set directory of uploaded images:
const dir = './uploads';
const upload = multer({
    dest: dir
    // Pour gérer des limitations sur ce qu'on accepte: https://github.com/expressjs/multer#limits
  });

// array of all lines drawn
var line_history = [];


module.exports = (logger) => {

    app.set('view engine', 'ejs');


    app.use(bodyParser.urlencoded({limit:'10mb', extended: false }));
    app.use(bodyParser.json());
    app.use("/uploads", express.static(__dirname + '/uploads'));
    app.use("/qrCodes", express.static(__dirname + '/qrCodes'));
    app.use("/images", express.static(__dirname + '/images'));
    app.use(express.static(path.join(__dirname, 'client')));


    app.post('/handlePost',(req,res) => {
        // var myImage=req.body.imageURL;

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"Resultat":myImage}));
        console.log(myImage);
        });
    //Handle multi part post request
    app.post(
        "/file-upload",
        upload.single("Image" /* name attribute of <file> element in your form */),
        (req, res) => {
            //log errors
            logger.error(req);
            const tempPath=req.file.path;
            //check number of images in uploads directory:
            var numberOfImages=0;
            var targetPath="";
            fs.readdir(dir, (err, files) => {
                numberOfImages=files.length;
                if (numberOfImages==1){
                    targetPath = path.join(__dirname, "./uploads/image.jpg");
                }
                else if(numberOfImages==2){
                    targetPath = path.join(__dirname, "./uploads/image2.jpg");
                }
                else if(numberOfImages==3){
                    targetPath = path.join(__dirname, "./uploads/image3.jpg");
                }
                else if(numberOfImages==4){
                    targetPath = path.join(__dirname, "./uploads/image4.jpg");
                }
                else if(numberOfImages==5){
                    oldestImageName=fct.getOldestFileName(files);
                    console.log(oldestImageName);
                    targetPath = path.join(__dirname, "./uploads/"+oldestImageName);
                }

                try{
                    if (path.extname(req.file.originalname).toLowerCase() === ".jpg" || path.extname(req.file.originalname).toLowerCase() === ".jpeg" || path.extname(req.file.originalname).toLowerCase() === ".png")   {
                        //Emit socket.io message:
                        //Peut etre plus élégant si j'arrive à faire passer directement l'image en binaire dans le message socket.io
                        io.sockets.emit('refresh-msg', { data: 'whatever'});
                        fs.rename(tempPath, targetPath, err => {
                            if (err){
                                console.log(err.stringify)
                            }

                            res
                            .status(200)
                            .contentType("text/plain")
                            .end("File uploaded!");
                        });
                    } else {
                        fs.unlink(tempPath, err => {
                            if (err) return handleError(err, res);

                            res
                            .status(403)
                            .contentType("text/plain")
                            .end("Only .jpg files are allowed!");
                        });
                    }
                }
                catch(err){
                    logger.error("Error:" + err.stringify);
                }
            });


        }
    );

    //reception of text message
    app.post('/postText',(req,res) => {
        var receivedText = req.body.sentText;

        fs.appendFile(config.textFile, receivedText+"\n", (err) => { //ajout d'une ligne au fichier d'écriture
            if (err) throw err;
        });

        res.status(200);
        res.setHeader('Content-Type', 'application/json'); //formulation d'une confirmation
        res.send(JSON.stringify({"Resultat":"text received"}));
        console.log("text received");
    });

    //endpoint to serve postedText content
    app.get('/postedText',(req,res) => {
        fs.readFile(config.textFile, 'utf8', function(err, data) {
            if (err) throw err;
            return res.end(data);
        });
    });

    app.get('/testsocket',(req,res) => {
        res.render('testSockets')
    });

    // io.on('connection', function(socket){
    //     socket.on('chat message', function(msg){
    //       io.emit('chat message', msg);
    //     });
    // });
    io.on('connection', function(socket){
        socket.on('chat message', function(msg){
          io.emit('chat message', msg);
        });

    });
    //When I receive the socket message:
    io.on('refresh-msg', function (socket) {
        console.log(socket);
    });

    app.get("/display", (req, res) => {
        //get the value of the fields in QRCodeRegister and store them in variables
        let rawQrRegister=fs.readFileSync(config.qrRegister);
        let qrRegister=JSON.parse(rawQrRegister);
        console.log("Difference2")
        console.log(qrRegister.qrCode2-Date.now())
        //Reset the qr code value to 0 (which means it should display a new qr Code) if user connected for more than 1 minute
        if (Date.now()-qrRegister.qrCode1>60000){
            qrRegister.qrCode1=0
            //Generate a new qrCode
            //TODO make a separate function to generate qr
            var download = function(uri, filename, callback){
                request.head(uri, function(err, res, body){
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            };
            download('http://api.qrserver.com/v1/create-qr-code/?data=CodeJoueur1&size=100x100&color=013668&bgcolor=ffffff', './qrCodes/qrCode1.png', function(){
            console.log('Qr Code 1 (blue) generated');
            });
        }
        if (Date.now()-qrRegister.qrCode2>60000){
            qrRegister.qrCode2=0
            //Generate a new qrCode
            //TODO make a separate function to generate qr
            var download = function(uri, filename, callback){
                request.head(uri, function(err, res, body){
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            };
            download('http://api.qrserver.com/v1/create-qr-code/?data=CodeJoueur2&size=100x100&color=d40000&bgcolor=ffffff', './qrCodes/qrCode2.png', function(){
            console.log('Qr Code 2 (red) generated');
            });
        }
        if (Date.now()-qrRegister.qrCode3>60000){
            qrRegister.qrCode3=0
            //Generate a new qrCode
            //TODO make a separate function to generate qr
            var download = function(uri, filename, callback){
                request.head(uri, function(err, res, body){
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            };
            download('http://api.qrserver.com/v1/create-qr-code/?data=CodeJoueur3&size=100x100&color=00b200&bgcolor=ffffff', './qrCodes/qrCode3.png', function(){
            console.log('Qr Code 3 (green) generated');
            });
        }
        if (Date.now()-qrRegister.qrCode4>60000){
            qrRegister.qrCode4=0
            //Generate a new qrCode
            //TODO make a separate function to generate qr
            var download = function(uri, filename, callback){
                request.head(uri, function(err, res, body){
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
            };
            download('http://api.qrserver.com/v1/create-qr-code/?data=CodeJoueur4&size=100x100&color=7500c0&bgcolor=ffffff', './qrCodes/qrCode4.png', function(){
            console.log('Qr Code 4 (purple) generated');
            });
        }
       /*
        //check number of qrCodes in directory:
        var numberOfCodes=0;
        var targetPath="";
        fs.readdir("./qrCodes", (err, files) => {
            numberOfCodes=files.length;
            if (numberOfCodes==1){
                //Generate a qrcode
                var download = function(uri, filename, callback){
                    request.head(uri, function(err, res, body){
                    console.log('content-type:', res.headers['content-type']);
                    console.log('content-length:', res.headers['content-length']);

                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                    });
                };
                download('http://api.qrserver.com/v1/create-qr-code/?data=CodeJoueur1Complique&size=100x100&color=013668&bgcolor=87ceeb', './qrCodes/qrCode1.png', function(){
                console.log('Qr Code generated');
                });
            }
        });*/
        //check number of images in uploads directory:
        var numberOfImages=0;
        fs.readdir(dir, (err, files) => {
            numberOfImages=files.length;
            console.log(numberOfImages);
            if (numberOfImages==1){
                console.log(qrRegister.qrCode1)
                res.render("handlePost",{qrRegister:qrRegister})
            }
            else if (numberOfImages==2){
                res.render("handlePost2",{qrRegister:qrRegister})
            }
            else if (numberOfImages==3){
                res.render("handlePost3",{qrRegister:qrRegister})
            }
            else if (numberOfImages==4){
                res.render("handlePost4",{qrRegister:qrRegister})
            }
        });
    });

    app.get('/home',(req,res)=>{
        res.render("home")
    });

    app.post('/authenticationPlayer1',(req,res) => {
        var barcodePlayer=req.body.barcodeSent;
        let rawQrRegister=fs.readFileSync(config.qrRegister);
        qrRegister=JSON.parse(rawQrRegister);
        res.setHeader('Content-Type', 'application/json');
        if (barcodePlayer=="CodeJoueur1"){
            res.status(200);
            res.send(JSON.stringify({"Resultat":barcodePlayer,"AuthStatus":"AuthGranted","Player":"Player 1"}));
            //Change the status in the register
            qrRegister.qrCode1=Date.now();
            qrRegister=JSON.stringify(qrRegister)
            fs.writeFileSync(config.qrRegister, qrRegister)
        }
        else if (barcodePlayer=="CodeJoueur2"){
            res.status(200);
            res.send(JSON.stringify({"Resultat":barcodePlayer,"AuthStatus":"AuthGranted","Player":"Player 2"}));
            //Change the status in the register
            qrRegister.qrCode2=Date.now();
            qrRegister=JSON.stringify(qrRegister)
            fs.writeFileSync(config.qrRegister, qrRegister)
        }
        else if (barcodePlayer=="CodeJoueur3"){
            res.status(200);
            res.send(JSON.stringify({"Resultat":barcodePlayer,"AuthStatus":"AuthGranted","Player":"Player 3"}));
            //Change the status in the register
            qrRegister.qrCode3=Date.now();
            qrRegister=JSON.stringify(qrRegister)
            fs.writeFileSync(config.qrRegister, qrRegister)
        }
        else if (barcodePlayer=="CodeJoueur4"){
            res.status(200);
            res.send(JSON.stringify({"Resultat":barcodePlayer,"AuthStatus":"AuthGranted","Player":"Player 4"}));
            //Change the status in the register
            qrRegister.qrCode4=Date.now();
            qrRegister=JSON.stringify(qrRegister)
            fs.writeFileSync(config.qrRegister, qrRegister)
        }
        else {
            res.status(401);
            res.send(JSON.stringify({ "Resultat": barcodePlayer, "AuthStatus": "AuthFailed" }));
        }

        /*
        if (barcodePlayer1=="CodeJoueur1Complique") {
        res.send(JSON.stringify({"Resultat":barcodePlayer1,"AuthStatus":"AuthGranted"}));
        }
        else {
        res.send(JSON.stringify({"Resultat":barcodePlayer1,"AuthStatus":"AuthFailed"}));
        }*/
        console.log('barcode reçu :'+ barcodePlayer)
        });


    app.get('/', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"Resultat":"Bonjour depuis agastache"}));
    });

    app.get('/drawing',(req,res)=>{
        res.render("drawing")
    });

    return http;

};
