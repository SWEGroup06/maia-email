// Modules
const Gmailpush = require('gmailpush');
const {htmlToText} = require('html-to-text');

// Credential setup
const gmailpush = new Gmailpush({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  pubsubTopic: 'projects/avid-renderer-293013/topics/Meetings',
});

const context = {
  // Fetch emails
  fetch: (notification) => {
    return new Promise((resolve, reject) => {
      gmailpush.getMessages({
        notification,
        token: JSON.parse(process.env.TOKEN),
      }).then((messages) => {
        if (!messages || !messages.length) {
          reject('No Messages');
          return;
        }
        resolve(messages.map((m) => {
          return {
            from: m.from,
            to: m.to,
            subject: m.subject,
            date: m.date,
            body: htmlToText(m.bodyHtml),
          };
        }));
      }).catch(reject);
    });
  },
};

module.exports = context;
