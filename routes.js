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
router.post('/webhook', function(req, res) {
  res.sendStatus(200);

  // Sometimes the email isnt actually in the inbox yet so wait for 500 ms before fetching mail
  setTimeout(async function() {
    try {
      const emails = await EMAIL.webhook.fetch(req.body);
      for (const email of emails) {
        const address = email.from.address;
        if (address == CONFIG.email) continue;

        // LOGIN email
        if (email.subject == 'LOGIN') {
          const data = await CONN.login(address);
          if (data.url) await EMAIL.mailer.sendMail(address, 'Maia Login Link', `<div>Click <a href='${data.url}'>here</a> to login</div>`);
          else if (data.exists) await EMAIL.mailer.sendMail(address, 'Maia Login Response', `<div>You are already signed in</div>`);
          else console.log(data);
          return;
        }

        // LOGOUT email
        if (email.subject == 'LOGOUT') {
          const data = await CONN.logout(address);
          console.log(data);
          await EMAIL.mailer.sendMail(address, 'Maia Logout', `<div>You signed out of the Maia AI Calendar Assistant</div>`);
          return;
        }

        // Else use NLP to determine command

        const title = email.subject;
        const members = [address].concat(email.to);

        // Format body removing first and last lines and concatenating into one line

        console.log({body: email.body});

        const text = email.body.trim()
            .replace(/\n\n/g, '\n')
            .replace(/\n\s\n/g, '\n\n')
            .split('\n\n').slice(1, -1).join(' ');

        console.log({text});

        const res = await CONN.nlp(text);

        console.log({res});

        // if (res.type == 'schedule') {
        //     await axios.get(CONFIG.serverURL + '/api/schedule', {
        //         params: {
        //             emails: members,
        //             title: title,
        //             flexible: res.data.flexible,
        //             duration: res.data.duration,
        //             startDateTimeOfRange: res.data.startDateTimeOfRange,
        //             endDateTimeOfRange: res.data.endDateTimeOfRange,
        //             beforeAfterKey: res.data.beforeAfterKey,
        //         }
        //     });

        //     await EMAIL.mailer.sendMail(address, `${title} Scheduled`,
        //                       `<div>Your event has been scheduled by Maia for${res.data.startDateTimeOfRange}</div>`);
        //     return;
        // }

        // if (res.type == 'reschedule') {
        //     await axios.get(CONFIG.serverURL + '/api/reschedule', {
        //         params: {
        //             meetingTitle: title,
        //             organiserSlackEmail: address,
        //             eventStartTime: res.data.eventStartTime,
        //             newStartDateTime: res.data.newStartDateTime,
        //             newEndDateTime: res.data.newEndDateTime,
        //             beforeAfterKey: res.data.beforeAfterKey,
        //         }
        //     });

        //     await EMAIL.mailer.sendMail(address, `${title} Re-scheduled`,
        //                     `<div>Your event has been re-scheduled by Maia from ${res.data.eventStartTime} to ${res.data.newStartDateTime}</div>`);
        //     return;
        // }
      }
    } catch (error) {
      console.error(error);
    }
  }, 500);
});

module.exports = router;
