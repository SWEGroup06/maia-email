// Load environment variables
require('dotenv').config();

// Modules
const express = require('express');
const Gmailpush = require('gmailpush');
const {htmlToText} = require('html-to-text');

const gmailpush = new Gmailpush({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    pubsubTopic: 'projects/avid-renderer-293013/topics/Meetings'
});

// Libraries
const CONFIG = require('./config.js');

// Setup REST Server
const app = express();
const PORT = process.env.PORT || 3000;

const email = 'maiacalendar123@gmail.com';
const token = {"access_token":"ya29.a0AfH6SMBZzeu3HqXtOqlBWCYscDf_9UrTK8n06JKUZsiVcQEM3qI6T1V-cS_hCl1OrOggd-GLg7eZWt7Z7BOtr7o0t5xmsrEceSD7Rd6IWWMhOHZ7os9kuafM3qMP1dwwiZVEv-pncIuADVZ7C5GQAP0qAL14KYOxfBHM5WgR1Zg","refresh_token":"1//07HLlGExgZhLfCgYIARAAGAcSNwF-L9IrTh_q09FeMnTrFU9vRikUsjBlFqvLf0dbFmZHeBdEg9-V2FAgy-3_Lm-CrBR3EfGtJiE","scope":"https://www.googleapis.com/auth/gmail.send openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.settings.basic","token_type":"Bearer","id_token":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjZhZGMxMDFjYzc0OThjMDljMDEwZGMzZDUxNzZmYTk3Yzk2MjdlY2IiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3NTM4OTUxMzcwODYtNWFpbG9iNWQ2N2JrYmNnOTRka2RjMW5ydDFtcW4yOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3NTM4OTUxMzcwODYtNWFpbG9iNWQ2N2JrYmNnOTRka2RjMW5ydDFtcW4yOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDc3ODExMjA0MDkyODUxNzMwNDAiLCJlbWFpbCI6Im1haWFjYWxlbmRhcjEyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ilh6el9fcVZwMXJNUGxyM0RUckhmS3ciLCJuYW1lIjoiTWFpYSBBSSBDYWxlbmRhciBBc3Npc3RhbnQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2hWcDNQbFNwbG01aWNsTC1EWDlHSzlPZ0RSY3VvZWpOcC1fUHhyPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik1haWEiLCJmYW1pbHlfbmFtZSI6IkFJIENhbGVuZGFyIEFzc2lzdGFudCIsImxvY2FsZSI6ImVuLUdCIiwiaWF0IjoxNjA4ODM1MDQ4LCJleHAiOjE2MDg4Mzg2NDh9.UrxRRgTSGJgVV_PsSMs0Z7lHEpIVTLocSMS_BHyQudHxW3bP-2ZVeUCyGgPP33Lwrk-VGlCYlA9tkPuyL67tVQ3_8lEQFwbE8ueFbp6oAlLHD29cIJCFFBUVRspSutNRGVqk4B0wM-s5ptuq-saS96Nz6zDWIAKTx0Ol2-aVYhU2p1w4yfHpmV8BIiM4MPtNoNnnGvixfOStcvkFX8wOy8wOenaJK-Iu3VHQp-WmhoVGvPKqspqVJe8RCh6Oh7c3kWiHcSYZPffUzoX2OgBWBmCBAxJBdW4p8AjMIuzSEStnMu1dLTokem3w3uVRmN8XWwR3hLc5LqylkGd0gTHVeA","expiry_date":1608838647546};

// Configure routes
app.use(express.json());

// ROOT PATH
app.get('/', function(_, res) {
    res.send('This is the EMAIL Server for Maia AI calendar assistant');
});

// Gmail Pub/Sub callback
app.post('/end', async function(req, res) {
    res.sendStatus(200);
    gmailpush.getMessages({
        notification: req.body,
        token
    }).then((messages) => {
        console.log(messages.map(m => {
            return {
                from: m.from,
                to: m.to,
                subject: m.subject,
                date: m.date,
                body: htmlToText(m.bodyHtml)
            }
        }))
    }).catch(console.error);
});

// Start Server
app.listen(PORT, () => {
    console.log(`EMAIL Server hosted on: ${CONFIG.serverURL}`);
});