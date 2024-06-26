const { differenceInHours } = require('date-fns/fp/differenceInHours');
const BookingModel = require('../../models/booking.model');
const { format } = require('date-fns')
const { differenceInMinutes } = require('date-fns/differenceInMinutes');
const GuardModel = require('../../models/guard.model');
const { logging } = require('googleapis/build/src/apis/logging');
const ParkingModel = require('../../models/parking.model')

exports.exceedTimeAndExceedprice = async (req, res) => {
  
  try {
    const { bookingId } = req.params;
    const booking = await BookingModel.findById(bookingId);
    console.log(booking.vehicle_number);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

      try {
        const id = booking.parking
        const Parking = await ParkingModel.findById(id);
        booking.actualOutTime = format(new Date(), "yyyy-MM-dd'T'HH:mm");
        booking.duration = differenceInMinutes(booking.outTime, booking.inTime);
        booking.actualDuration = differenceInMinutes(booking.actualOutTime, booking.actualInTime);
        const unit = booking.actualDuration - booking.duration-8;
        // console.log(unit);

        if (unit > 0) {
            // console.log(booking?.vehicle_type);
            // console.log(Parking.exceed_priceF);
          const exceedPrice = booking.vehicle_type == "two wheeler"?  Parking.exceed_priceT : Parking.exceed_priceF;
          // console.log(exceedPrice);
          booking.exceedPrice = exceedPrice * (unit / Parking.exceed_price_for)
          booking.exceedCGST = Math.ceil(booking.exceedPrice * 0.09);
          booking.exceedSGST = Math.ceil(booking.exceedPrice * 0.09);
          booking.exceedTime = unit
        }
        else {
          booking.exceedPrice = 0
          booking.exceedCGST = 0
          booking.exceedSGST = 0
          booking.exceedTime = 0
        }
        booking.exceedTotalPrice = booking.exceedCGST + booking.exceedSGST + booking.exceedPrice
        booking.bookingPrice = booking.totalPrice + booking.exceedTotalPrice;

        await booking.save()
        res
          .status(200)
          .json({ message: "Booking status updated successfully", data: booking });
      }
      catch (err) {
        res.json(err)
      }
    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

