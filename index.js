const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const multer = require("multer");
const path = require("path");
const _=require("underscore")
const fs = require("fs");
const reload = require("reload");
const http = require("http").Server(app);
const qrcode=require("qrcode-generator");
const request=require("request");

var io=require('socket.io')(http);

//Set directory of uploaded images:
const dir = './uploads';
const upload = multer({
    dest: dir
    // Pour gérer des limitations sur ce qu'on accepte: https://github.com/expressjs/multer#limits
  });




module.exports = (logger) => {

    app.set('view engine', 'ejs');


    app.use(bodyParser.urlencoded({limit:'10mb', extended: false }));
    app.use(bodyParser.json());
    app.use("/uploads", express.static(__dirname + '/uploads'));
    app.use("/qrCodes", express.static(__dirname + '/qrCodes'));


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
                    oldestImageName=getOldestFileName(files)
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
    //When I receive the socket message:
    io.on('refresh-msg', function (socket) {
        console.log("oui");
        console.log(socket);
    });

    app.get("/display", (req, res) => {
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
        });
        
        //check number of images in uploads directory:
        var numberOfImages=0;
        fs.readdir(dir, (err, files) => {
            numberOfImages=files.length;
            console.log(numberOfImages);
            if (numberOfImages==1){
                res.render("handlePost")
            }
            else if (numberOfImages==2){
                res.render("handlePost2")
            }
            else if (numberOfImages==3){
                res.render("handlePost3")
            }
            else if (numberOfImages==4){
                res.render("handlePost4")
            }
        });
        
        
    });

    app.get('/home',(req,res)=>{
        
        res.render("home")

    });

    app.post('/authenticationPlayer1',(req,res) => {
        var barcodePlayer1=req.body.barcodeSent;
        res.setHeader('Content-Type', 'application/json');
        if (barcodePlayer1=="CodeJoueur1Complique") {
        res.send(JSON.stringify({"Resultat":barcodePlayer1,"AuthStatus":"AuthGranted"}));
        }
        else {
        res.send(JSON.stringify({"Resultat":barcodePlayer1,"AuthStatus":"AuthFailed"}));
        }
        console.log('barcode reçu :'+ barcodePlayer1)
        });


    app.get('/', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"Resultat":"Bonjour depuis agastache"}));
    });

    function getOldestFileName(files) {
    
        // use underscore for min()
        return _.min(files, function (f) {
            var fullpath = path.join(dir, f);
    
            // ctime = creation time is used
            // replace with mtime for modification time
            return fs.statSync(fullpath).ctime;
        });
    }

    return app;

}
// //Define port
// const PORT = process.env.PORT || 10410;

// //Run the server using express
// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}...`);
// });
