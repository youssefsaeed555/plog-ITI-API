// eslint-disable-next-line import/no-extraneous-dependencies
const nodeMailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    secure: true,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //mailOptions
  const mailOptions = {
    from: `HandMade <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //sendMail
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
