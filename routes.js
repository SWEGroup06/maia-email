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
            const address = email.from.address;
            if (address == CONFIG.email) continue;
            if (email.subject == 'LOGIN') {
                const data = await CONN.login(address);
                if (data.url) await EMAIL.mailer.sendMail(address, 'Maia Login Link', `<div>Click <a href='${data.url}'>here</a> to login</div>`);
                else if (data.exists) await EMAIL.mailer.sendMail(address, 'Maia Login Response', `<div>You are already signed in</div>`);
                else console.log(data);
                return;
            }
            if (email.subject == 'LOGOUT') {
                const data = await CONN.logout(address);
                console.log(data);
                await EMAIL.mailer.sendMail(address, 'Maia Logout', `<div>You signed out of the Maia AI Calendar Assistant</div>`);
                return;
            }
        }
    } catch (err) {
        console.error(err);
    }
    
});

module.exports = router;