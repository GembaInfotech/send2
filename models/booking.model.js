const mongoose = require("mongoose");
const Database = require("../config/database");
const bookingSchema = new mongoose.Schema({
  user: {
    type: String
  },
  parking: {
    type: String 
  },
  inTime: {
    type: String,
  },
  outTime: {
    type: String,
  },
  actualInTime:String,
  actualOutTime:String,
  duration:String,
  actualDuration:Number,
  // BookingDate: { type: Date, default: Date.now },
  BookingDate:String,
  exceedTime: Number,
  vehicleNumber: String,
  price: Number,
  cgst: Number,
  sgst: Number,
  exceedPrice: Number,
  exceedCGST:Number,
  exceedSGST:Number,
  exceedTotalPrice:Number,
  totalPrice: Number,
  bookingPrice:Number,
  paymentId:String,
  vehicle_name:String,
      vehicle_number:String,
      vehicle_type:String,
  
  parkedAt:{
    spaceName:String,
    spaceId:String
  },
  checkinBy:{
    guardId:String,
    guardName:String
  },
  checkoutBy:{
    guardId:String,
    guardName:String
  },
  
  status: {
    type: String,
    enum: ["Pending","Incoming", "Parked", "Completed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
