const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const reload = require("reload");
const http = require("http").Server(app);
var io=require('socket.io')(http);
const upload = multer({
    dest: "./uploads"
    // Pour gérer des limitations sur ce qu'on accepte: https://github.com/expressjs/multer#limits
  });
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({limit:'10mb', extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static(__dirname + '/uploads'));


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
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "./uploads/image.jpg");
        if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
        //Emit socket.io message:
        //Peut etre plus élégant si j'arrive à faire passer directement l'image en binaire dans le message socket.io
        io.sockets.emit('refresh-msg', { data: 'whatever'});
        fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);

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
);
//When I receive the socket message:
io.on('refresh-msg', function (socket) {
    console.log("oui");
    console.log(socket);
});

app.get("/image.jpg", (req, res) => {
    // res.sendFile(path.join(__dirname, "./uploads/image.jpg"));
    res.render("handlePost")
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


//Define port
const PORT = process.env.PORT || 10410;

//Run the server using express
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
