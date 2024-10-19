


const vendorModel = require('../models/vendor.model')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path'); 
const fs = require('fs');
const { fromPath } = require("pdf2pic");
const  pdftopic= require("pdftopic");

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

const getVendorDetails = async (req, res, next) => {
  try {
    console.log("hello");
    const {vendorId} = req.params
    const vendor = await vendorModel.findById({_id:vendorId}).select("-password").lean();
    res.status(200).json(vendor);
  } catch (err) {
    next(err);
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
    console.log("vendorData", vendorData)

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
  const gteId = req.query.createdBy;
  // console.log(gteId)
  try {
    const vendors = await vendorModel.find({ createdBy: gteId });
    const vendorsCount = await vendorModel.find({ createdBy: gteId }).countDocuments();
    console.log("vendor counting......", vendorsCount)

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVendors = async (req, res, next) => {
  try {
    // Fetch vendors and select only the fields you need
    const vendors = await vendorModel.find().select('_id code firstName lastName');
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

    const {id} = req.body;
    const isValidVendor = await vendorModel.exists({ _id: id });
    console.log(isValidVendor);
    if (!isValidVendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found for the given vendor ID' });
    }
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

const uploadDocs = async (req, res) => {
  const { id, uploadType } = req.body; 
  console.log("hdhjdje", req.body);
  

  try {
    const vendor = await vendorModel.findById(id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found for the given vendor ID' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload a file.' });
    }

    let folder = '';
    switch (uploadType) {
      case 'vendorGST':
        folder = 'VendorGST';
        vendor.gstImage = []; 
        req.files.forEach(uploadedFile => {
          const imagePath = uploadedFile.filename;
          vendor.gstImage.push(imagePath); 
        });
        break;
      case 'vendorAadhar':
        folder = 'VendorAadhar';
        vendor.adhaarImage = []; 
        req.files.forEach(uploadedFile => {
          const imagePath = uploadedFile.filename;
          vendor.adhaarImage.push(imagePath); 
        });
        break;
      case 'vendorLicense':
        folder = 'VendorLicense';
        vendor.licenseImage = []; 
        req.files.forEach(uploadedFile => {
          const imagePath = uploadedFile.filename;
          vendor.licenseImage.push(imagePath); 
        });
        break;
      case 'vendorPan':
        folder = 'VendorPan';
        vendor.panImage = []; 
        req.files.forEach(uploadedFile => {
          const imagePath = uploadedFile.filename;
          vendor.panImage.push(imagePath); // Push the new image path
        });
        break;
      case 'vendorProfile':
        folder = 'VendorProfile';
        vendor.profileImage = []; // Replace the existing profileImage array
        req.files.forEach(uploadedFile => {
          const imagePath = uploadedFile.filename;
          vendor.profileImage.push(imagePath); // Push the new image path
        });
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid upload type' });
    }

    // Save the updated vendor information
    await vendor.save();

    // Respond with success message and file information
    res.status(200).json({
      success: true,
      message: 'Files uploaded and saved successfully!',
      files: req.files.map(file => ({
        fileName: file.filename,
        filePath: path.join('ProfileImage', folder, file.filename),
      })), 
    });

  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Error updating vendor', error: error.message });
  }
};

const profileUpload = async (req, res) => {
  const {id} = req.body;
  try {
    const vendor = await vendorModel.findById({_id:id});

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found for the given vendor ID' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file.' });
    }
    const profileType = req.body.type || 1; 
    let folder = '';

    if (profileType === 2) {
      folder = 'GuardProfileImg';
    } else if (profileType === 1) {
      folder = 'VendorProfileImg';
    } else {
      return res.status(400).json({ message: 'Invalid profile type.' });
    }
    vendor.profileImage = req.file.filename ;
    await vendor.save();
    res.json({
      message: 'File uploaded and saved successfully!',
      // fileName: req.file.filename,
      // filePath: path.join('ProfileImage', folder, req.file.filename), 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving file info to vendor profile.', error });
  }
};

const sendProfile = async(req, res) =>{
  const { image } = req.params;
  const imagePath = path.join(__dirname,'..', 'ProfileImage', 'VendorProfileImg', image); 
  console.log(imagePath);
  

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
}


// const { fromPath } = require('pdf2pic');
// const fs = require('fs');
// const path = require('path');

const sendDocs = async (req, res) => {
  console.log("hello");
  
  const { type, image } = req.params;

  console.log("image", type);
  console.log(image);

  let pdfPath;
  switch (type) {
    case "profile":
      pdfPath = path.join(__dirname, '..', 'ProfileImage', 'VendorProfileImg', image);
      break;
    case "aadhar":
      pdfPath = path.join(__dirname, '..', 'ProfileImage', 'VendorAadhar', image);
      console.log(pdfPath);
      break;
    case "gst":
      pdfPath = path.join(__dirname, '..', 'ProfileImage', 'VendorGST', image);
      break;
    case "pan":
      pdfPath = path.join(__dirname, '..', 'ProfileImage', 'VendorPan', image);
      break;
    default:
      return res.status(400).json({ message: "Invalid type" });
  }

  console.log(`PDF Path: ${pdfPath}`);
// ********
const options = {
  density: 100,
  saveFilename: "first_page",
  savePath: "./images",
  format: "png",
  width: 800,
  height: 1000,
};

const storeAsImage = fromPath(pdfPath, options);

try {
  const result = await storeAsImage(1); // Converts the first page
  const imagePath = result.path; // The path to the saved image

  // Serve the image file in response
  if (fs.existsSync(imagePath)) {
    res.sendFile(path.resolve(imagePath));
  } else {
    res.status(404).send("Image not found");
  }
} catch (error) {
  console.error("Error converting PDF to image:", error);
  res.status(500).send("Internal Server Error");
}

// return res.send("ok")
return;




  // ***
  // const options = {
  //   density: 100, // Image resolution
  //   saveFilename: image, // Save image name
  //   savePath: "./images", // Save image to this directory
  //   format: "png", // Output format
  //   width: 600, // Width of image
  //   height: 800, // Height of image
  // };

  // const convert = fromPath(pdfPath, options);

  // try {
  //   // Convert first page of PDF to image
  //   const page1 = await convert(1); // Convert first page

  //   // Read the image file and send it as a response
  //   const imageBuffer = fs.readFileSync(page1.path);
  //   res.contentType("image/png");
  //   res.send(imageBuffer);
  // } catch (err) {
  //   res.status(500).send("Error converting PDF to image");
  // }
  return;
  // Convert the first page of the PDF to an image
  // const outputDir = path.join(__dirname, '..', 'ProfileImage', 'PreviewImages');

  // Ensure the output directory exists
  // if (!fs.existsSync(outputDir)) {
  //   fs.mkdirSync(outputDir, { recursive: true });
  // }

  // const outputImagePath = path.join(outputDir, `${path.basename(image, '.pdf')}-0.png`);

  // console.log("outputImagePath", outputImagePath);
  
  // try {
  //   // Check if the image is already generated
  //   if (!fs.existsSync(outputImagePath)) {
  //     console.log(`Generating preview for: ${pdfPath}`);
      
  //     // Convert the first page of the PDF
  //     await convert(1); // 1 for the first page

  //     console.log("Image generated successfully");
  //   }

  //   // Send the image to the frontend
  //   res.sendFile(outputImagePath, (err) => {
  //     if (err) {
  //       res.status(404).send('Preview image not found');
  //     }
  //   });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: 'Error generating PDF preview', error: error.message });
  // }
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
  uploadDocs,
  profileUpload,
  sendProfile,
  sendDocs,
  getVendorDetails
};
