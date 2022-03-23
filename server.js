const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = 3001;

app.use(bodyParser.json());

// Main Endpoint
app.get('/', (req, res) => {
    res.send('This is the default endpoint for Content-MS.');
});

app.listen(PORT, () => {
    console.log(`Service running on ${PORT}.`);
})

