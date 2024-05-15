const GuardModel = require('../models/guard.model')
const ParkingModel = require('../models/parking.model')

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const vendorToken = require("../models/vendorToken.model")
const guardToken = require("../models/guardToken.model")
const { saveLogInfo } = require("../middlewares/logger/logInfo");
const duration = require("dayjs/plugin/duration");
const dayjs = require("dayjs");
const { findOne } = require('../models/parking.model');
dayjs.extend(duration);


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
  
      res.status(200).json({
        accessToken,
        refreshToken,
        accessTokenUpdatedAt: new Date().toLocaleString(),
        guard: {
          _id: existingGuard._id,
          name: existingGuard.name,
          email: existingGuard.email,
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
  
  const addGuard = async (req, res, next) => {
    try {
        const guardData = { ...req.body };
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

        const newGuard = new GuardModel({
            ...guardData,
            password: hashedPassword,
        });

        console.log("New Guard: ", newGuard);
        await newGuard.save();

        const updatedParkingDetail = await ParkingModel.findOneAndUpdate(
            { _id: req.params.parkingid },
            { $push: { guard_id: newGuard._id } },
            { new: true }
        );

        res.status(200).json({
            data: newGuard,
            updatedParkingDetail
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to add Guard",
        });
    }
};

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

const updateGuard = async (req, res, next) => {
    try {
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

  module.exports = {
    addGuard,
    signin,
    getGuard,
    updateGuard  
  };
  