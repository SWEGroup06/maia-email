// Load environment variables
require('dotenv').config();

// Modules
const express = require('express');

// Libraries
const CONFIG = require('./config.js');
const IMAP = require('./lib/imap.js');

// Setup REST Server
const app = express();
const PORT = process.env.PORT || 3000;

// Configure routes
app.use(express.json());

// Start IMAP Client
IMAP.init().then(() => {
    // ROOT PATH
    app.get('/', function(_, res) {
        res.send('This is the EMAIL Server for Maia AI calendar assistant');
    });

    // Gmail Pub/Sub callback
    app.post('/end', async function(req, res) {
        IMAP.getLatestEmail().then(console.log).catch(console.error);
        res.sendStatus(200);
    });

    // Start Server
    app.listen(PORT, () => {
        console.log(`EMAIL Server hosted on: ${CONFIG.serverURL}`);
    });
}).catch(console.error);
