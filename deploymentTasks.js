const request=require('request')
const fs = require("fs");


module.exports={
    generateQRCodes : function(){
        //Generate a qrcode
        var download = function(uri, filename, callback){
            request.head(uri, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
        
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
        };
        //blue (player 1)
        download('http://api.qrserver.com/v1/create-qr-code/?data=CodeJoueur1Complique&size=100x100&color=013668&bgcolor=ffffff', './qrCodes/qrCode1.png', function(){
        console.log('Qr Code 1 (blue) generated');
        });
        //red (player 2)
        download('http://api.qrserver.com/v1/create-qr-code/?data=CodeJoueur2&size=100x100&color=d40000&bgcolor=ffffff', './qrCodes/qrCode2.png', function(){
        console.log('Qr Code 2 (red) generated');
        });
        //green (player 3)
        download('http://api.qrserver.com/v1/create-qr-code/?data=CodeJoueur3&size=100x100&color=00b200&bgcolor=ffffff', './qrCodes/qrCode3.png', function(){
        console.log('Qr Code 3 (green) generated');
        });
        //purple (player 4)
        download('http://api.qrserver.com/v1/create-qr-code/?data=CodeJoueur4&size=100x100&color=7500c0&bgcolor=ffffff', './qrCodes/qrCode4.png', function(){
        console.log('Qr Code 4 (purple) generated');
        });
    },
    //Generate the register corresponding to the 4 unscanned qr codes
    generateRegisterForQrCodes : function (){
        let myJsonData={
            qrCode1: "true",
            qrCode2: "true",
            qrCode3: "true",
            qrCode4: "true",
        }
        myJsonData=JSON.stringify(myJsonData)
        fs.writeFileSync('./qrCodes/QRCodeRegister.json', myJsonData)
    }
}