const express = require('express');
const bodyParser= require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/handlePost',(req,res) => {
    var myImage=request.body.imageUrl;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({"Resultat":myImage}))
    });

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({"Resultat":"Bonjour depuis agastache"}));
});




const PORT = process.env.PORT || 10402;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});