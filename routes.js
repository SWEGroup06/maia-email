// Config
const CONFIG = require('./config.js');

// Modules
const express = require('express');
const axios = require('axios');

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
                else console.log(data);
                return;
            }
            if (email.subject == 'LOGOUT') {
                const data = await CONN.logout(address);
                console.log(data);
                await EMAIL.mailer.sendMail(address, 'Maia Logout', `<div>You signed out of the Maia AI Calendar Assistant</div>`);
                return;
            }

            const title = email.subject;
            const members = [address].concat(email.to);
            let body = email.body;
            body = body.split(/\n/).map(s => s.trim()).filter(s => s.length !== 0);
            body = body.slice(1, body.length - 2)
            const res = await axios.get(CONFIG.serverURL + '/nlp/', {
                params: {
                    text: encodeURIComponent(JSON.stringify(body.join(' '))),
                }
            });

            if (res.type == 'schedule') {
                await axios.get(CONFIG.serverURL + '/api/schedule', {
                    params: {
                        emails: members,
                        title: title,
                        flexible: res.data.flexible,
                        duration: res.data.duration,
                        startDateTimeOfRange: res.data.startDateTimeOfRange,
                        endDateTimeOfRange: res.data.endDateTimeOfRange,
                        beforeAfterKey: res.data.beforeAfterKey,
                    }
                });

                await EMAIL.mailer.sendMail(address, `${title} Scheduled`,
                                  `<div>Your event has been scheduled by Maia for${res.data.startDateTimeOfRange}</div>`);
                return;
            }

            if (res.type == 'reschedule') {
                await axios.get(CONFIG.serverURL + '/api/reschedule', {
                    params: {
                        meetingTitle: title,
                        organiserSlackEmail: address,
                        eventStartTime: res.data.eventStartTime,
                        newStartDateTime: res.data.newStartDateTime,
                        newEndDateTime: res.data.newEndDateTime,
                        beforeAfterKey: res.data.beforeAfterKey,
                    }
                });

                await EMAIL.mailer.sendMail(address, `${title} Re-scheduled`,
                                `<div>Your event has been re-scheduled by Maia from ${res.data.eventStartTime} to ${res.data.newStartDateTime}</div>`);
                return;
            }


        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
    
});

module.exports = router;