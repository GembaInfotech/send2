const nodemailer = require("nodemailer");
const UserPreference = require("../../models/preference.model");
const User = require("../../models/user.model");
const EmailVerification = require("../../models/email.model");
const { query, validationResult } = require("express-validator");
const { verifyEmailHTML } = require("../../utils/emailTemplates");

const CLIENT_URL = process.env.CLIENT_URL;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;

const verifyEmailValidation = [
  query("email").isEmail().normalizeEmail(),
  query("code").isLength({ min: 5, max: 5 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

const sendVerificationEmail = async (req, res) => {
  const USER = process.env.EMAIL;
  const PASS = process.env.PASSWORD;
  const { email, name } = req.body;
  console.log("Start")
console.log(req.body)
  const verificationCode = Math.floor(10000 + Math.random() * 90000);
  const verificationLink = `http://localhost:3000/auth/verify?code=${verificationCode}&email=${email}`;
    console.log("mid")
    console.log(verificationLink)
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ayushguptass14@gmail.com",
        pass: "fdizpvbebqkdkgku",
      },
    });
   console.log("smid")
   try{

    const mailOptions = {
      from: "ayushguptass14@gmail.com",
      to: email,
      subject: "Parkar-Verify Your Email",
      html: verifyEmailHTML(name, verificationLink, verificationCode),
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
   
   }
   catch(er)

   {
    console.log(er)
   }
   console.log("last")
    const newVerification = new EmailVerification({
      email,
      verificationCode,
      messageId: info.messageId,
      for: "signup",
    });
    console.log("0")
    await newVerification.save();

    res.status(200).json({
      message: `Verification email was successfully sent to ${email}`,
    });
  } catch (err) {
    console.log(
      "Could not send verification email. There could be an issue with the provided credentials or the email service."
    );
    res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyEmail = async (req, res, next) => {
  const { code, email } = req.query;
  console.log(code, email)
  try {
    const [isVerified, verification] = await Promise.all([
      User.findOne({ email: { $eq: email }, isEmailVerified: false }),
      EmailVerification.findOne({
        email: { $eq: email },
        verificationCode: { $eq: code },
      }),
    ]);
     console.log("here")
    if (isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (!verification) {
      return res
        .status(400)
        .json({ message: "Verification code is invalid or has expired" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: { $eq: email } },
      { isEmailVerified: true },
      { new: true }
    ).exec();

    await Promise.all([
      EmailVerification.deleteMany({ email: { $eq: email } }).exec(),
      new UserPreference({
        user: updatedUser,
        enableContextBasedAuth: true,
      }).save(),
    ]);

    req.userId = updatedUser._id;
    req.email = updatedUser.email;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  verifyEmailValidation,
};



