const nodemailer = require("nodemailer");
const asyncHandler = require("express-expressAsyncHandler");

const sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 578,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  let info = await transporter.sendMail({
    from: '"Hey 😍" <abc@gmail.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.htm,
  });

  console.log("message sent: %s", info.messageId);
});

module.exports = sendEmail;
