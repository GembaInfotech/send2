const { differenceInHours } = require('date-fns/fp/differenceInHours');
const BookingModel = require('../../models/booking.model');
const { format } = require('date-fns')
const { differenceInMinutes } = require('date-fns/differenceInMinutes');
const ParkingModel = require('../../models/parking.model');
const parkingSpace = require('../../models/parkingSpace.model');
const GuardModel = require('../../models/guard.model');
const { logging } = require('googleapis/build/src/apis/logging');
const Decimal = require('decimal.js');

exports.bookingStatus = async (req, res) => {
  const { status,parkedAt, guardid, spaceId } = req.body;

  console.log("req.body", req.body)
  try {
    const { bookingId } = req.params;
    const booking = await BookingModel.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status === status) return res
      .status(400)
      .json({ error: "Booking status is already parked" });
    if (status == "Parked") {
      try {
        const Guard = await GuardModel.findById(guardid)

        const ParkingSpace = await parkingSpace.findById(spaceId);

        console.log("ParkingSpace", ParkingSpace);
        
        if (!ParkingSpace) return res.status(404).json({ error: "Parking Space not found" });
        if (ParkingSpace.isOccupied) {
          return res.status(405).json({ error: "Space is already Occupied" })
        }
        if (!ParkingSpace.isOccupied) {
          ParkingSpace.isOccupied = true;
          await ParkingSpace.save();
        }
        booking.checkinBy.guardId = Guard.code
        booking.checkinBy.guardName = Guard.name
        booking.parkedAt.spaceName = parkedAt
        booking.parkedAt.spaceId = spaceId
        booking.status = status;
        const value = format(new Date(), "yyyy-MM-dd'T'HH:mm");
        console.log(value);
        booking.actualInTime = format(new Date(), "yyyy-MM-dd'T'HH:mm");
        booking.status = status;
        await booking.save();
        res
          .status(200)
          .json({ message: "Booking status updated successfully", data: booking });
      }
      catch (err) {
        res.json(err)
      }
    }
    else if (status === "Completed") {
      try {
        console.log("Completed Status");
        const Guard = await GuardModel.findById(guardid)

        const ParkingSpace = await parkingSpace.findById(spaceId);
        if (ParkingSpace.isOccupied) {
          ParkingSpace.isOccupied = false;
          await ParkingSpace.save();
        }
        const id = booking.parking
        const Parking = await ParkingModel.findById(id);

        booking.checkoutBy.guardId = Guard.code
        booking.checkoutBy.guardName = Guard.name

        booking.status = status;
        console.log("status for completed", booking.status);

        const value = format(new Date(), "yyyy-MM-dd'T'HH:mm");
        const outDate = value.split("T")[0]
        const validityDate = Parking.validity_ToDate
        if(outDate > validityDate) {
          console.log("validity date expire");
        }
        console.log(value, "hekker");
       console.log(new Date());
        booking.actualOutTime = format(new Date(), "yyyy-MM-dd'T'HH:mm");
        booking.duration = differenceInMinutes(booking.outTime, booking.inTime);
        booking.actualDuration = differenceInMinutes(booking.actualOutTime, booking.inTime);
        const unit = booking.actualDuration - booking.duration - process.env.NON_CONSIDERABLE_EXCEED_TIME_IN_MINUTE;

        if (unit > 0 && outDate <= validityDate) {
          const exceedPrice = booking.vehicle_type== "two wheeler"?  Parking.exceed_priceT : Parking.exceed_priceF;
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
        
        booking.plateform_fee_percentage = 1;
        booking.plateform_fee_amount = parseFloat((booking.bookingPrice * booking.plateform_fee_percentage / 100).toFixed(2));
        booking.plateform_GST_amount = parseFloat((booking.plateform_fee_amount * 0.18).toFixed(2));
        booking.total_plateform_amount = parseFloat((parseFloat(booking.plateform_fee_amount) + parseFloat(booking.plateform_GST_amount)).toFixed(2));
        booking.payment_amount_after_fee_deduction = parseFloat((booking.totalPrice - booking.total_plateform_amount).toFixed(2));
        try {
          await booking.save()
        } catch (error) {
          console.log(error);
        }
        console.log(booking);
        res
          .status(200)
          .json({ message: "Booking status updated successfully", data: booking });
      }
      catch (err) {
        res.json(err)
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

