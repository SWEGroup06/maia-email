// Load environment variables
require("dotenv").config();

// Config
const CONFIG = require("./config.js");

// Modules
const express = require("express");

// Libraries
const EMAIL = require("./lib/email/index.js");

// Setup REST Server
const app = express();
const PORT = process.env.PORT || 3000;

// Configure routes
app.use(express.json());
app.use("/", require("./routes.js"));

// Start Server
app.listen(PORT, () => {
  const notif = `EMAIL Server hosted on: ${CONFIG.url}`;
  console.log(notif);
  EMAIL.mailer.sendMail(
    CONFIG.email,
    "Maia Calendar: Init",
    `<div>${notif}</div>`
  );
});
