const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({"Resultat":"Bonjour depuis agastache"}));
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 10402;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});