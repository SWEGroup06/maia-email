
// Modules
const express = require('express');

// Libraries
const EMAIL = require('./lib/email/index.js');

// Setup router
const router = express.Router();

// Home
router.get('/', function(_, res) {
    res.send('This is the EMAIL Server for Maia AI calendar assistant');
});

// Gmail Pub/Sub callback
router.post('/webhook', function(req, res) {
    res.sendStatus(200);
    EMAIL.webhook.fetch(req.body).then(console.log).catch(console.error);
});

// Gmail Pub/Sub callback
router.get('/send', function(req, res) {
    EMAIL.mailer.sendMail('kpal81xd@gmail.com', 'LOGIN REQUIRED', 'link goes here')
        .then(() => res.status(200).send('ok'))
        .catch(() => res.status(500).send('Internal Server Error'));
});

module.exports = router;