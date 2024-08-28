const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "prashantrana9516@gmail.com",
      pass: "qqjsatrjwvbynknu",
    },
  });

function sendVerificationEmail(Admin, emailTemplate) {
    console.log("Sending email...");
    console.log(Admin);
    
    const mailOptions = {
      from: "prashantrana9516@gmail.com",
      to: "s.yadav@gembainfotech.com", // Assuming 'Admin' has an 'email' property
      subject: "Parkar - Verify Your Email",
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

module.exports = {sendVerificationEmail};
