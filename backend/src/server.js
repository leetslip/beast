const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const DISCORD_TOKEN = process.env.TOKEN;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample API route
app.get('/api', (req, res) => {
    res.send('Hello from the backend!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});