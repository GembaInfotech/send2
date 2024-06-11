const { differenceInHours } = require('date-fns/fp/differenceInHours');
const BookingModel = require('../../models/booking.model');
const { format } = require('date-fns')
const { differenceInMinutes } = require('date-fns/differenceInMinutes');
const ParkingModel = require('../../models/parking.model');
const parkingSpace = require('../../models/parkingSpace.model');
const GuardModel = require('../../models/guard.model')


exports.bookingStatus = async (req, res) => {
  const { status, tp, parkedAt, guardid, spaceId } = req.body;
  console.log(req.body);

  try {
    const { bookingId } = req.params;


    const booking = await BookingModel.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status === status) return res
      .status(400)
      .json({ error: "Booking status is already completed" });
    if (status == "Parked") {
      try {
        const Guard = await GuardModel.findById(guardid)
        const ParkingSpace = await parkingSpace.findById(spaceId);
        if (!ParkingSpace) return res.status(404).json({ error: "Parking Space not found" });
        if (ParkingSpace.isOccupied) {
          return res.status(405).json({ error: "Space is already Occupied" })
        }
        if (!ParkingSpace.isOccupied) {
          ParkingSpace.isOccupied = true;
          await ParkingSpace.save();
          res
            .status(205)

        }

        booking.checkinBy.guardId = Guard.code
        booking.checkinBy.guardName = Guard.name
        booking.parkedAt.spaceName = parkedAt
        booking.parkedAt.spaceId = spaceId
        booking.status = status;
        const value = format(new Date(), "yyyy-MM-dd'T'HH:MM");
        booking.actualInTime = value
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
        const Guard = await GuardModel.findById(guardid)

        const ParkingSpace = await parkingSpace.findById(spaceId);
        if (ParkingSpace.isOccupied) {
          ParkingSpace.isOccupied = false;
          await ParkingSpace.save();
          res
            .status(206)
        }
        console.log("here")
        console.log(booking.parking)
        const id = booking.parking
        const Parking = await ParkingModel.findById(id);

        booking.checkoutBy.guardId = Guard.code
        booking.checkoutBy.guardName = Guard.name


        booking.status = status;
        console.log("here")

        const value = format(new Date(), "yyyy-MM-dd'T'HH:MM");
        booking.actualOutTime = value

        booking.duration = differenceInMinutes(booking.outTime, booking.inTime);
        booking.actualDuration = differenceInMinutes(booking.actualOutTime, booking.actualInTime);

        const unit = booking.actualDuration - booking.duration;
        if (unit > 0) {
          booking.exceedPrice = Parking?.exceed_price * (unit / Parking.exceed_price_for)

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
    }


  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

