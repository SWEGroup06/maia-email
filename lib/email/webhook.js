// Modules
const Gmailpush = require('gmailpush');
const {htmlToText} = require('html-to-text');

// Credential setup
const gmailpush = new Gmailpush({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    pubsubTopic: 'projects/avid-renderer-293013/topics/Meetings'
});

const context = {
    // Fetch first email
    fetch: (notification) => {
        return new Promise((resolve, reject) => {
            gmailpush.getMessages({
                notification,
                token: JSON.parse(process.env.TOKEN)
            }).then((messages) => {
                if (!messages || !messages.length) reject(new Error('No Messages'))
                const m = messages[0];
                resolve({
                    from: m.from,
                    to: m.to,
                    subject: m.subject,
                    date: m.date,
                    body: htmlToText(m.bodyHtml)
                });
            }).catch(reject);
        });
    }
}

module.exports = context;