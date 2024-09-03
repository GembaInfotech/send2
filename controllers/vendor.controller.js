const vendorModel = require('../models/vendor.model')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const vendorToken = require("../models/vendorToken.model")
const { saveLogInfo } = require("../middlewares/logger/logInfo");
const duration = require("dayjs/plugin/duration");
const dayjs = require("dayjs");
const { findOne } = require('../models/parking.model');
const { generatevendorCode } = require('../handlers/codeHandler/Codes');
dayjs.extend(duration);
const { sendVerificationEmail } = require('../utils/nodemailer.js');
const {VendorAccountVerificationTemplate} = require('../emailTemplate/VendorAccountVerification.js')


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
    const { email, password } = req.body;
    console.log(req.body);
    const existingVendor = await vendorModel.findOne({
      email: { $eq: email },
    });
    console.log(existingVendor);
    if (!existingVendor) {
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

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingVendor.password
    );

    console.log(isPasswordCorrect);

    if (!isPasswordCorrect) {
      await saveLogInfo(
        req,
        MESSAGE.INCORRECT_PASSWORD,
        LOG_TYPE.SIGN_IN,
        LEVEL.ERROR
      );
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: existingVendor._id,
      email: existingVendor.email,
    };

  

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    try {
      const existingToken = await vendorToken.findOne({
        vendor: { $eq: existingVendor._id.toString() },
      });

      if (existingToken?.vendor) {
        await vendorToken.deleteOne({ _id: existingToken._id });
      }
    } catch (err) {
      console.error(err);
    }

    const newRefreshToken = new vendorToken({
      vendor: existingVendor._id,
      refreshToken,
      accessToken,
    });
    await newRefreshToken.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      vendor: {
        _id: existingVendor._id,
        name: existingVendor.name,
        email: existingVendor.email,
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
      const vendor = req.userId
    if (vendor) {
      await vendorToken.deleteOne({ vendor });
      await saveLogInfo(
        null,
        MESSAGE.LOGOUT_SUCCESS,
        LOG_TYPE.LOGOUT,
        LEVEL.INFO
      );
    }
    res.status(200).json({
      message: "Vendor Logout successful",
    });
  } catch (err) {
    await saveLogInfo(null, err.message, LOG_TYPE.LOGOUT, LEVEL.ERROR);
    res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

const getVendor = async (req, res, next) => {
  try {
    console.log("hello");
    const id = req.userId
    const vendor = await vendorModel.findById(id).select("-password").lean();
    res.status(200).json(vendor);
  } catch (err) {
    next(err);
  }
};

const addVendor = async (req, res, next) => {
  try {
    const vendorData = { ...req.body };

    const existingVendor = await vendorModel.findOne({ email: vendorData.email });
    if (existingVendor) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(vendorData.password, 10);

    const code = await generatevendorCode();

    const newVendor = new vendorModel({
      code,
      ...vendorData,
      password: hashedPassword,
    });

    await newVendor.save();  
      const customizedTemplate = VendorAccountVerificationTemplate
      .replace('%NAME%', newVendor.firstName)
      .replace('%EMAIL%', newVendor.email)
      .replace('%PASSWORD%', vendorData.password)
      .replace('%LINK%', 'http://localhost:5173/');
            sendVerificationEmail(newVendor, customizedTemplate);
    
    res.status(200).json({
      data: newVendor,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add Vendor",
    });
  }
};


const updateVendor = async (req, res, next) => {
  try {
    const id = req.userId;
    const updateData = req.body.data;

    const updatedVendor = await vendorModel.findByIdAndUpdate(id, updateData, { new: true }).select("-password").lean();
    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(updatedVendor);
  } catch (err) {
    next(err);
  }
};

const updateVendorById = async (req, res, next) => {
  try {
    const vednorId = req.params
    const updateData = req.body.data;

    const updatedVendor = await vendorModel.findByIdAndUpdate(vednorId, updateData, { new: true }).select("-password").lean();
    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(updatedVendor);
  } catch (err) {
    next(err);
  }
};

const updateVendorStatus = async (req, res, next) => {
  try {
    const id = req.userId;
    const { vendorStatus } = req.body;
    const updatedVendor = await vendorModel.findByIdAndUpdate(
      id,
      { vendorStatus },
      { new: true }
    ).select("-password").lean();
    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(updatedVendor);
  } catch (err) {
    next(err);
  }
};

const getAllVendor = async (req, res, next) => {
  // console.log("gte's vendors")
  const gteId = req.params.gteId;
  // console.log(gteId)
  try {
    const vendors = await vendorModel.find({ createdBy: gteId });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getVendors = async(req, res, next) => {
  console.log("get vendors");
  const createdBy = req.query.createdBy;
  console.log(createdBy)
  try {
    const vendors = await vendorModel.find({ createdBy });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    console.log(refreshToken);

    const existingToken = await vendorToken.findOne({
      refreshToken: { $eq: refreshToken },
    });
    if (!existingToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }
    const existingUser = await VendorModel.findById(existingToken.vendor);
    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const refreshTokenExpiresAt =
      jwt.decode(existingToken.refreshToken).exp * 1000;
    if (Date.now() >= refreshTokenExpiresAt) {
      await existingToken.deleteOne();
      return res.status(401).json({
        message: "Expired refresh token",
      });
    }

    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "2m",
    });

    res.status(200).json({
      accessToken,
      refreshToken: existingToken.refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const gstUpload = async (req, res) => {
  try {
      // console.log(req.body, req.params, req.userId);
      const {id} = req.body;
      console.log(id);
    // Check if the vendor ID is valid
    const isValidVendor = await vendorModel.exists({ _id: id });
    console.log(isValidVendor);
    if (!isValidVendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found for the given vendor ID' });
    }

    // Update the parking
    const updatedVendor = await vendorModel.findByIdAndUpdate(id, 
      { $push: { gstImage : req?.imagepath.url } }

      , { new: true });
    console.log(updatedVendor);

    if (!updatedVendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.status(200).json({ success: true, message: 'Vendor updated successfully', vendor: updatedVendor });
  } catch (error) {
      console.log(error)
    res.status(500).json({ success: false, message: 'Error updating vendor', error: error.message });
  }
};



const businessLicenceUpload = async (req, res) => {
  try {
      // console.log(req.body, req.params, req.userId);
      const {id} = req.body;
      console.log(id);
    // Check if the vendor ID is valid
    const isValidVendor = await vendorModel.exists({ _id: id });
    console.log(isValidVendor);
    if (!isValidVendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found for the given vendor ID' });
    }

    // Update the parking
    const updatedVendor = await vendorModel.findByIdAndUpdate(id, 
      { $push: { businessLicenceImage : req?.imagepath.url } }

      , { new: true });
    console.log(updatedVendor);

    if (!updatedVendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.status(200).json({ success: true, message: 'Vendor updated successfully', vendor: updatedVendor });
  } catch (error) {
      console.log(error)
    res.status(500).json({ success: false, message: 'Error updating vendor', error: error.message });
  }
};

const panUpload = async (req, res) => {
  try {
      // console.log(req.body, req.params, req.userId);
      const {id} = req.body;
      console.log(id);
    // Check if the vendor ID is valid
    const isValidVendor = await vendorModel.exists({ _id: id });
    console.log(isValidVendor);
    if (!isValidVendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found for the given vendor ID' });
    }

    // Update the parking
    const updatedVendor = await vendorModel.findByIdAndUpdate(id, 
      { $push: { panImage : req?.imagepath.url } }

      , { new: true });
    console.log(updatedVendor);

    if (!updatedVendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.status(200).json({ success: true, message: 'Vendor updated successfully', vendor: updatedVendor });
  } catch (error) {
      console.log(error)
    res.status(500).json({ success: false, message: 'Error updating vendor', error: error.message });
  }
};


const adhaarUpload = async (req, res) => {
  try {
      // console.log(req.body, req.params, req.userId);
      const {id} = req.body;
      console.log(id);
    // Check if the vendor ID is valid
    const isValidVendor = await vendorModel.exists({ _id: id });
    console.log(isValidVendor);
    if (!isValidVendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found for the given vendor ID' });
    }

    // Update the parking
    const updatedVendor = await vendorModel.findByIdAndUpdate(id, 
      { $push: { adhaarImage : req?.imagepath.url } }

      , { new: true });
    console.log(updatedVendor);

    if (!updatedVendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.status(200).json({ success: true, message: 'Vendor updated successfully', vendor: updatedVendor });
  } catch (error) {
      console.log(error)
    res.status(500).json({ success: false, message: 'Error updating vendor', error: error.message });
  }
};
const profileUpload = async (req, res) => {
  try {
      // console.log(req.body, req.params, req.userId);
      const {id} = req.body;
      console.log(id);
    // Check if the vendor ID is valid
    const isValidVendor = await vendorModel.exists({ _id: id });
    console.log(isValidVendor);
    if (!isValidVendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found for the given vendor ID' });
    }

    // Update the parking
    const updatedVendor = await vendorModel.findByIdAndUpdate(id, 
      { $push: { profileImage : req?.imagepath.url } }

      , { new: true });
    console.log(updatedVendor);

    if (!updatedVendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.status(200).json({ success: true, message: 'Vendor updated successfully', vendor: updatedVendor });
  } catch (error) {
      console.log(error)
    res.status(500).json({ success: false, message: 'Error updating vendor', error: error.message });
  }
};
module.exports = {
  addVendor,
  signin,
  getVendor,
  logout,
  updateVendor,
  updateVendorStatus,
  getAllVendor,
  getVendors,
  updateVendorById,
  refreshToken,
  gstUpload,
  businessLicenceUpload,
  panUpload,
  adhaarUpload,
  profileUpload
};
