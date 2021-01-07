// Config
const CONFIG = require("./config.js");

// Modules
const express = require("express");

// Libraries
const EMAIL = require("./lib/email/index.js");
const CONN = require("./lib/connection.js");
const COMMANDS = require("./lib/commands.js")(CONN, EMAIL);

const EmailReplyParser = require("email-reply-parser");

// Setup router
// eslint-disable-next-line new-cap
const router = express.Router();

// Home
router.get("/", function (_, res) {
  res.send("This is the EMAIL Server for Maia AI calendar assistant");
});

// Gmail Pub/Sub callback
router.post("/webhook", function (req, res) {
  res.sendStatus(200);

  // Sometimes the email isnt actually in the inbox yet so wait for 500 ms before fetching mail
  setTimeout(async function () {
    try {
      const emails = await EMAIL.webhook.fetch(req.body);
      for (const email of emails) {
        const address = email.from.address;
        if (address == CONFIG.email) continue;

        const allEmails = [
          address,
          ...email.to.map((em) => em.address),
          ...(email.cc ? email.cc.map((em) => em.address) : []),
        ];

        const event = {
          title: email.subject,
          organiser: address,
          members: allEmails.filter(
            (em) => em != CONFIG.email && em != address
          ),
        };

        // Handle specific cases
        if (["LOGIN", "LOGOUT", "HELP"].includes(email.subject)) {
          await COMMANDS[email.subject.toLowerCase()].action(event);
          return;
        }

        // Ensures that only the latest message is considered, ignoring any
        // messages in the thread.
        const latestMessage = new EmailReplyParser().parseReply(email.body);

        // Format body removing first and last lines and concatenating into one line
        const parsed = latestMessage
          .trim()
          .replace(/\n\n/g, "\n")
          .replace(/\n\s\n/g, "\n\n");

        const returns = parsed.match(/\n\n/g);
        const formatters = [
          (text) => text,
          (text) => text.split("\n\n")[0],
          (text) => text.split("\n\n").slice(1, -1).join(" "),
        ];

        let text;
        if (returns && returns.length && formatters[returns.length]) {
          text = formatters[returns.length](parsed);
        } else {
          text = formatters[0](parsed);
        }

        // Use NLP to determine command
        const res = await CONN.nlp(text);
        if (res.error) throw new Error(res.error);
        if (res.type === "unknown") {
          console.error("INVALID COMMAND");
          await EMAIL.mailer.sendMail(
            address,
            "Maia Calendar: Error",
            `<div>${res.msg}</div><br>
            <div>The command "${text}" could not be recognised</div>`
          );
          return;
        }
        const cmd = COMMANDS[res.type];
        if (cmd && cmd.action) await cmd.action(event, res);
      }
    } catch (err) {
      // Any other type of error
      const msg = "REST webhook Error: " + err.message;
      console.error(msg);
    }
  }, 500);
});

module.exports = router;
