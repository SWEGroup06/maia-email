// Config
const CONFIG = require('./config.js');

// Modules
const express = require('express');

// Libraries
const EMAIL = require('./lib/email/index.js');
const CONN = require('./lib/connection.js');

// Setup router
const router = express.Router();

// Home
router.get('/', function(_, res) {
    res.send('This is the EMAIL Server for Maia AI calendar assistant');
});

// Gmail Pub/Sub callback
router.post('/webhook', async function(req, res) {
    res.sendStatus(200);
    try {
        const emails = await EMAIL.webhook.fetch(req.body);
        for (const email of emails) {
            if (email.from.address == CONFIG.email) continue;
            if (email.subject == 'LOGIN') {
                const address = email.from.address;
                const data = await CONN.login(address);
                await EMAIL.mailer.sendMail(address, 'Maia Login Link', `<div>Click <a href='${data.url}'>here</a> to login</div>`);
                return;
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
    
});

module.exports = router;