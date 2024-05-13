'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
// const { format } = require('date-fns');

const VendorSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
      uppercase: true
    },
    lastName: {
      type: String,
      required: false,
      uppercase: true
    },
    contact: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
    },
    password2: {
      type: String,
      required: false,
    },
    createdOnDate: {
      type: String,
    },
    acceptedTerms: {
      type: Boolean,
    },
    vendorStatus: {
      type: String,
      enum: ['Pending','Verified', 'Active', 'InActive'],
      default: 'Pending'
    },
    vendorActive: {
      type: Boolean,
    },
    token: {
      type: String,
      required: false,
    },
    pincode: {
      type: Number,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['Vendor'],
      default: 'Vendor'
    },
    tokens: [{
      reftoken: {
        type: String
      },
      timeStamp: {
        type: String
      }
    }]
  },
  { timestamps: true }
);

VendorSchema.methods.generateRefreshToken = async function(){
  try{
    let reftoken = jwt.sign(
      { username: this.uniqueId },
      process.env.JWT_SECRET,
      {
        // TODO: SET JWT TOKEN DURATION HERE
        expiresIn:  '1h',
      }
    );
    let timeStamp = format(new Date(), 'Pp');
    this.tokens = this.tokens.concat({reftoken, timeStamp});
    await this.save();
    return reftoken;
  } catch(err){
    console.log("Error")
  }
}
VendorSchema.methods.generateAuthToken = async function(){
  try{
    let token = jwt.sign(
      { username: this.uniqueId },
      process.env.JWT_SECRET,
      {
        // TODO: SET JWT TOKEN DURATION HERE
        expiresIn:  '10m',
      }
    );
    return token;
  } catch(err){
    console.log("Error")
  }
}
module.exports = mongoose.model('VendorModel', VendorSchema);
