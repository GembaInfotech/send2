'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParkingSpaceSchema = new Schema(
  {
    spaceId: String,
    vehicletype:{
        type: String,
          enum: ["fourWheeler", "twoWheeler"],
    },
    parkingCode:{
      type:String,
      index:true
    },
  isOccupied: { type: Boolean, default: false }
  }
);
const ParkingSpace = mongoose.model('ParkingSpace', ParkingSpaceSchema);

module.exports = ParkingSpace;
