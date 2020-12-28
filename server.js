// Load environment variables
require('dotenv').config();

// Config
const CONFIG = require('./config.js');

// Modules
const express = require('express');

// Setup REST Server
const app = express();
const PORT = process.env.PORT || 3000;

// Configure routes
app.use(express.json());
app.use('/', require('./routes.js'));

// Start Server
app.listen(PORT, () => {
    console.log(`EMAIL Server hosted on: ${CONFIG.serverURL}`);
});