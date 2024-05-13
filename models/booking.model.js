const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  user: {
    type: String
  },
  parking: {
    type: String 
  },
  inTime: {
    type: Date,
  },
  outTime: {
    type: Date,
  },
  actualInTime:String,
  actualOutTime:String,
  duration:Number,
  actualDuration:Number,
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
  status: {
    type: String,
    enum: ["Pending","Incoming", "Parked", "Completed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
