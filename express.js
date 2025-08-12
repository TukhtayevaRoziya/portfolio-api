require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

app.use(cors());

function sendEmail(name, email, message) {
  console.log(process.env.EMAIL_USER);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = "Mail Regarding Feedback";
  const to = email;
  const from = process.env.EMAIL_USER;
  const template = handlebars.compile(
    fs.readFileSync(path.join(__dirname, "templates/", "feedbacks.hbs"), "utf8")
  );
  const template2 = handlebars.compile(
    fs.readFileSync(path.join(__dirname, "templates/", "tome.hbs"), "utf8")
  );

  const html = template({ name, message });
  const html2 = template2({ email, message });
  const mailOption = {
    from,
    to,
    subject,
    html,
  };
  const mailOption2 = {
    from,
    to,
    subject,
    html2,
  };
  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });

  transporter.sendMail(mailOption2, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log(name, email, message);
  sendEmail(name, email, message);
});

app.get('/', (req, res) => {
  res.send("Hello World");
});

// app.listen(2300, () => {
//   console.log("Ofc working duh");
// });


module.exports = app;
