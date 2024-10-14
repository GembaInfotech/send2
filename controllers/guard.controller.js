const GuardModel = require('../models/guard.model')
const ParkingModel = require('../models/parking.model')
const ForgetPassword = require('../models/forgetPassword.model.js')
const crypto = require("crypto")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const vendorToken = require("../models/vendorToken.model")
const guardToken = require("../models/guardToken.model")
const { saveLogInfo } = require("../middlewares/logger/logInfo");
const duration = require("dayjs/plugin/duration");
const dayjs = require("dayjs");
const { findOne } = require('../models/parking.model');
const { generateGaurdCode } = require('../handlers/codeHandler/Codes');
dayjs.extend(duration);
const path = require('path');
const {sendVerificationEmail} = require('../utils/nodemailer.js')
const { GuardAccountVerificationTemplate} = require ('../emailTemplate/GuardAccountVerificaton.js')
const {GuardForgetPasswordTemplate} = require('../emailTemplate/GuardForgetPassword.js')


const LOG_TYPE = {
    SIGN_IN: "sign in",
    LOGOUT: "logout",
  };
  
  const LEVEL = {
    INFO: "info",
    ERROR: "error",
    WARN: "warn",
  };
  
  const MESSAGE = {
    SIGN_IN_ATTEMPT: "Vendor attempting to sign in",
    SIGN_IN_ERROR: "Error occurred while signing in vendor: ",
    INCORRECT_EMAIL: "Incorrect email",
    INCORRECT_PASSWORD: "Incorrect password",
    DEVICE_BLOCKED: "Sign in attempt from blocked device",
    CONTEXT_DATA_VERIFY_ERROR: "Context data verification failed",
    MULTIPLE_ATTEMPT_WITHOUT_VERIFY:
      "Multiple sign in attempts detected without verifying identity.",
    LOGOUT_SUCCESS: "Vendor has logged out successfully",
  };
  

const signin = async (req, res, next) => {
    console.log("hello");
    console.log(req.body);
    await saveLogInfo(
      req,
      MESSAGE.SIGN_IN_ATTEMPT,
      LOG_TYPE.SIGN_IN,
      LEVEL.INFO
    );
  
    try {
      const { email
        // , password
     } = req.body;
      console.log(req.body);
      const existingGuard = await GuardModel.findOne({
        email: { $eq: email },
      });
      console.log(existingGuard);
      if (!existingGuard) {
        await saveLogInfo(
          req,
          MESSAGE.INCORRECT_EMAIL,
          LOG_TYPE.SIGN_IN,
          LEVEL.ERROR
        );
        return res.status(404).json({
          message: "Invalid credentials",
        });
      }
  
      // const isPasswordCorrect = await bcrypt.compare(
      //   password,
      //   existingGuard.password
      // );
  
      // console.log(existingGuard.password);
  
      // if (!isPasswordCorrect) {
      //   await saveLogInfo(
      //     req,
      //     MESSAGE.INCORRECT_PASSWORD,
      //     LOG_TYPE.SIGN_IN,
      //     LEVEL.ERROR
      //   );
      //   return res.status(400).json({
      //     message: "Invalid credentials",
      //   });
      // }
  
      const payload = {
        id: existingGuard._id,
        email: existingGuard.email,
        profile:existingGuard?.profileImage
      };
  
      console.log("testing...1");
  
      const accessToken = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "30m",
      });
  
      const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: "7d",
      });
  
      try {
        const existingToken = await guardToken.findOne({
          guard: { $eq: existingGuard._id.toString() },
        });
  
        if (existingToken?.guard) {
          await guardToken.deleteOne({ _id: existingToken._id });
        }
      } catch (err) {
        console.error(err);
      }
  
      const newRefreshToken = new guardToken({
        guard: existingGuard._id,
        refreshToken,
        accessToken,
      });
      await newRefreshToken.save();
      console.log(existingGuard.parking);
      res.status(200).json({
        accessToken,
        refreshToken,
        accessTokenUpdatedAt: new Date().toLocaleString(),
        guard: {
          _id: existingGuard._id,
          name: existingGuard.name,
          email: existingGuard.email,
          parking:existingGuard.parking,
          profile:existingGuard?.profileImage

        },
      });
    } catch (err) {
      await saveLogInfo(
        req,
        MESSAGE.SIGN_IN_ERROR + err.message,
        LOG_TYPE.SIGN_IN,
        LEVEL.ERROR
      );
  
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

  const logout = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      // console.log(authHeader);
      console.log(authHeader);
      const accessToken = authHeader.split(" ")[1];
      if (accessToken) {
        await guardToken.deleteOne({ accessToken });
        await saveLogInfo(
          null,
          MESSAGE.LOGOUT_SUCCESS,
          LOG_TYPE.LOGOUT,
          LEVEL.INFO
        );
      }
     
      res.status(200).json({
        message: "Guard Logout successful",
      });
    } catch (err) {
      await saveLogInfo(null, err.message, LOG_TYPE.LOGOUT, LEVEL.ERROR);
      res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }
  };

const changePassword = async (req, res) => {
  try {

    const guard = req.guard;
    const { currentPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(currentPassword, guard.password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: 'Current password is incorrect' });
    // }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    guard.password = hashedNewPassword;
    await guard.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
const addGuard = async (req, res, next) => {
  try {
      const guardData = { ...req.body };
      console.log(req.body);
      const vendor = req.userId
      console.log(guardData);

      const existingGuard = await GuardModel.findOne({ email: guardData.email });
      console.log("exist", existingGuard);

      if (existingGuard) {
          return res.status(400).json({
              message: "Email already exists",
          });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(guardData.password, 10);

      // Include the parking ID in guard data
      const newGuard = new GuardModel({
          ...guardData,
          password: hashedPassword,
          parking: req.params.parkingid,
          vendor:req.userId
           // Assuming parking ID is passed as a parameter
      });
      const code  = await generateGaurdCode();
      newGuard.code=code;

      console.log("New Guard: ", newGuard);
      await newGuard.save();

      const customizedTemplate = GuardAccountVerificationTemplate
      .replace('%NAME%', newGuard.name)
      .replace('%EMAIL%', newGuard.email)
      .replace('%PASSWORD%', guardData.password)
      .replace('%LINK%', 'http://localhost:5173/');
            sendVerificationEmail(newGuard, customizedTemplate);

      const updatedParkingDetail = await ParkingModel.findOneAndUpdate(
          { _id: req.params.parkingid },
          { $push: { guard_id: newGuard._id } },
          { new: true }
      );

      res.status(200).json({
          data: newGuard,
          // updatedParkingDetail
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: "Failed to add Guard",
      });
  }
};

const UploadGuardProfile = async (req, res) => {
  const guard = req.guard;

  if (!req.file) {
    return res.status(400).send({ message: 'Please upload a file.' });
  }

  const profileType = req.body.profileType || 'Guard'; 
  let folder = '';

  if (profileType === 'Guard') {
    folder = 'GuardProfileImg';
  } else if (profileType === 'vendor') {
    folder = 'VendorProfileImg';
  } else {
    return res.status(400).send({ message: 'Invalid profile type.' });
  }
  guard.profileImage = req.file.filename;

  try {
    await guard.save();
    res.send({
      message: 'File uploaded and saved successfully!',
      fileName: req.file.filename,
      filePath: path.join('ProfileImage', folder, req.file.filename)
    });
  } catch (error) {
    res.status(500).send({ message: 'Error saving file info to guard profile.' });
  }
};
const sendProfile = async(req, res) =>{
  const { image } = req.params;
  const imagePath = path.join(__dirname,'..', 'ProfileImage', 'GuardProfileImg', image); 
  console.log(imagePath);
  

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
}
const getGuard = async (req, res, next) => {
    try {
        const guardId = req.params.guardId; // Assuming the guard id is passed as req.params.id
        console.log(guardId);

        // Find the guard by id
        const guard = await GuardModel.findById(guardId);

        if (!guard) {
            return res.status(404).json({
                message: "Guard not found",
            });
        }

        res.status(200).json({
            data: guard,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to get guard",
        });
    }
};

const getGuardsByParkingId = async (req, res, next) => {
  try {
    console.log("dhsjkfjk");
      const parkingId = req.params.parkingId; // Assuming the parking id is passed as req.params.id
      console.log(parkingId);

      // Find the parking document by id
      const parking = await ParkingModel.findById(parkingId);

      if (!parking) {
          return res.status(404).json({
              message: "Parking not found",
          });
      }

      // Extract the guard IDs from the parking document
      const guardIds = parking.guard_id;

      // Find all guards whose IDs are in the guardIds array
      const guards = await GuardModel.find({ _id: { $in: guardIds } });

      if (!guards) {
          return res.status(404).json({
              message: "Guards not found",
          });
      }

      res.status(200).json({
          data: guards,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: "Failed to get guards",
      });
  }
};

const updateGuard = async (req, res, next) => {
    try {
      // const vendor = req.userId;
        const guardId = req.params.guardId; 
        const guard = await GuardModel.findById(guardId);
        console.log(req.body);

        if (!guard) {
            return res.status(404).json({
                message: "Guard not found",
            });
        }

        guard.name = req.body.data.name || guard.name;
        guard.email = req.body.data.email || guard.email;
        guard.address = req.body.data.address || guard.address;
        // guard.aadhar = req.body.aadhar || guard.aadhar;
        guard.contact = req.body.data.contact || guard.contact;
        guard.active = req.body.data.active || guard.active;
        await guard.save();

        res.status(200).json({
            message: "Guard updated successfully",
            data: guard,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update guard",
        });
    }
};

const getAllGuardsByVendorId = async (req, res, next) => {
  try {
    const vendorId = req.userId; // Assuming req.userId contains the vendor ID
    const guards = await GuardModel.find({ vendor: vendorId });

    if (!guards || guards.length === 0) {
      return res.status(404).json({
        message: "No guards found for this vendor",
      });
    }

    res.status(200).json({
      message: "Guards found for this vendor",
      data: guards,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch guards for this vendor",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find guard by email
    const guard = await GuardModel.findOne({ email });

    // If guard not found, return 404
    if (!guard) {
      return res.status(404).json({ error: 'Guard not found' });
    }

    // Generate a random token
    const forgetToken = crypto.randomBytes(20).toString('hex');

    // Save the token in ForgetPassword collection
    await ForgetPassword.create({
      userId: guard._id,
      email,
      token: forgetToken,
      verified: '0'
    });

    // Create reset URL
    const resetUrl = `http://localhost:3000/#/reset-password/${forgetToken}/`;

    // Data to be used in the email
    const Data = {
      email,
      link: resetUrl
    };

    console.log("link", Data.link);

    // Send the password reset email
    const customizedTemplate = GuardForgetPasswordTemplate
      .replace('%NAME%', guard.name)
      .replace('%EMAIL%', Data.email)
      .replace('%LINK%', Data.link);
      sendVerificationEmail(guard, customizedTemplate);

    // If email is sent, return success response
    console.log("Password reset link has been sent to your email id");
    return res.status(200).json({ message: "Password reset link has been sent to your email id", guard });
  } catch (error) {
    // Handle errors
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const resetPasswordRedirect = async (req, res) => {
  try {
    let forgotToken = req.params.token; 
    console.log(forgotToken);

    // Find the token in the ForgetPassword collection
    const data = await ForgetPassword.findOne({ token: forgotToken });

    console.log("data", data);

    // If no data is found or the token is already verified
    if (!data || data.verified === "1") {
      console.log("data", data);
      log.dev("Wrong password reset link!", "");
      return res.status(400).json({
        message: "This link has expired or is incorrect!",
      });
    }

    // If the token is valid and not yet used
    console.log("Link verified", "");
    return res.status(200).json({
      message: "Link verified",
    });

  } catch (err) {
    // Handle any errors
    console.log("Something went wrong with reset_verify-- ", err);
    return res.status(500).json({
      message: "Something went wrong, please try again!",
    });
  }
};

function validatePW(str) {
  if (str.length <= 5) return false;
  if (!/[A-Z]/.test(str)) return false;
  if (!/[a-z]/.test(str)) return false;
  return true;
}

const resetPassword = async (req, res) => {
  console.log("hello");
  let forgotToken = req.body.token; 
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword) {
      return response.throw(202, "Passwords do not match!", "", res);
  }

  if (!validatePW(password)) {
      return response.throw(500, "Invalid: Password doesn't meet the requirements", "", res);
  }

  try {
      const data = await ForgetPassword.findOne({ token: forgotToken });
      if (!data) {
          return response.throw(201, "Please check password reset link", "", res);
      }
      const guard = await GuardModel.findOne({ email: data.email });
      if (!guard) {
          return response.throw(201, "User not found", "", res);
      }
      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);
      await GuardModel.updateOne({ email: data.email }, { password: hash });
      await ForgetPassword.updateOne({ token: forgotToken }, { verified: "1" });

      return response.throw(200, "Password reset successfully!", "", res);

  } catch (err) {
      log.test("Something went wrong with reset_password", err);
      return response.throw(201, "Something went wrong, please try again", "", res);
  }
};


  module.exports = {
    addGuard,
    signin,
    logout,
    getGuard,
    getGuardsByParkingId,
    updateGuard ,
    getAllGuardsByVendorId,
    UploadGuardProfile,
    changePassword,
    forgotPassword,
    resetPasswordRedirect,
    resetPassword,
    sendProfile
  };
  