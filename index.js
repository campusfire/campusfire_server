const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bonjour depuis agastache');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 10402;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});