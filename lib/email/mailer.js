// Config
const CONFIG = require('../../config.js');

// Modules
const Nodemailer = require('nodemailer');

// Credential setup
const transporter = Nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: CONFIG.email,
    pass: process.env.EMAIL_PASS,
  },
});

const context = {
  sendMail: function(email, subject, bodyHtml) {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: CONFIG.email,
            to: email,
            subject,
            html: bodyHtml,
        }, function(err, info) {
            if (err) {
                reject(err);
                return;
            }
            resolve(info.response);
        });
    })
  },
};

module.exports = context;


