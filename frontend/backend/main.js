const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");


const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("The server started on port 3000 !!!!!!");
});

app.get("/", (req, res) => {
  res.send(
    {
      message: "Welcome to the server !!!!!!"
    }
  );
});

app.post("/send-event-mail", (req, res) => {
  const { emails, eventName, discount } = req.body;
  // for each email send an email
  emails.forEach(email => {
    sendEventMail(info => {
      console.log(`The event mail has been sent to ${email} ${info.messageId}`);
      res.send(info);
    }, email, eventName, discount).catch(r => {});
  });

});


function getEmailTransporter(){
  let details = {
    user: "strucarchpakistan@gmail.com",
    pass: "struct-arch@pakistan"
  }
  // create reusable transporter object using the default SMTP transport
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: details.user,
      pass: details.pass
    }
  });
}

async function sendEventMail(callback, email, eventName, discount){
  let transporter = getEmailTransporter();
  let info = await transporter.sendMail({
    from: '"Reflection Store" <ReflectionStore.rs@gmail.com>',
    to: email, // list of receivers
    subject: "A New Event", // Subject line
    html: "<div>" +
      `<span>EventName: </span> <span>${eventName}</span>` +
      "</div>" +
      "<div>" +
      `<span>Discount: </span> <span>${discount}</span>` +
      "</div>", // html body

  });
  callback(info);
}
