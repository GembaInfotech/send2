const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function sendVerificationEmail(user, emailTemplate, subject) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: subject,
    html: emailTemplate,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent successfully: " + info.response);
    }
  });
}

module.exports = {sendVerificationEmail };
