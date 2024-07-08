'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
// const { format } = require('date-fns');

const VendorSchema = new Schema(
  {
    code: {
      type: String,
      required: false,
    },
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
    panNo: {
      type: String,
    },
    gstNo: {
      type: String,
    },
    companyRegNo: {
      type: String,
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
      default: false
    },
    vendorStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Active', 'InActive'],
      default: 'Pending'
    },
    vendorActive: {
      type: Boolean,
      default: false
    },

    businessLicenceImage: [{
      type: String
    }],
    gstImage: [{
      type: String
    }],

    panImage: [{
      type: String
    }],
    gstImage: [{
      type: String
    }],
    adhaarImage: [{
      type: String
    }],
    profileImage: [{
      type: String
    }],

    token: {
      type: String,
      required: false,
    },
    billingAddress: {
      address: {
        type: String
      },
      postalCode: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      contact: {
        type: String
      },
      email: {
        type: String
      },
      country: {
        type: String
      }
    },
    communicationAddress: {
      address: {
        type: String
      },
      postalCode: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      contact: {
        type: String
      },
      email: {
        type: String
      },
      country: {
        type: String
      }
    },
    
    role: {
      type: String,
      enum: ['Vendor'],
      default: 'Vendor'
    },
    title: {
      type: String,
      enum: ["Individuals", "propWriter", "M/S"]
    },
    account: {
      accountHolder: {
        type: String,
      },
      accountNumber: {
        type: String,
      },
      bankName: {
        type: String,
      },
      branchName: {
        type: String,
      },
      ifscCode: {
        type: String,
      },
      BranchEmail: {
        type: String,
      }
    },
    createdBy: {
      type: String
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

VendorSchema.methods.generateRefreshToken = async function() {
  try {
    let reftoken = jwt.sign(
      { username: this.uniqueId },
      process.env.JWT_SECRET,
      {
        // TODO: SET JWT TOKEN DURATION HERE
        expiresIn: '1h',
      }
    );
    let timeStamp = new Date().toISOString();
    this.tokens = this.tokens.concat({ reftoken, timeStamp });
    await this.save();
    return reftoken;
  } catch (err) {
    console.log("Error")
  }
}

VendorSchema.methods.generateAuthToken = async function() {
  try {
    let token = jwt.sign(
      { username: this.uniqueId },
      process.env.JWT_SECRET,
      {
        // TODO: SET JWT TOKEN DURATION HERE
        expiresIn: '10m',
      }
    );
    return token;
  } catch (err) {
    console.log("Error")
  }
}

module.exports = mongoose.model('VendorModel', VendorSchema);
