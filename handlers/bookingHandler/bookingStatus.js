const { differenceInHours } = require('date-fns/fp/differenceInHours');
const BookingModel = require('../../models/booking.model');
const {format } = require('date-fns')
const  { differenceInMinutes } = require('date-fns/differenceInMinutes');
const  ParkingModel =require( '../../models/parking.model');

exports.bookingStatus = async (req, res) => {
    const { status , tp} = req.body;
    try {
      const { bookingId } = req.params;
      const booking = await BookingModel.findById(bookingId);
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      if (booking.status === status)  return res
          .status(400)
          .json({ error: "Booking status is already completed" });
          if(status=="Parked")
            {
              try{

                booking.status = status;
 const value = format(new Date(), "yyyy-MM-dd'T'HH:MM");
                booking.actualInTime =value
                booking.status = status;
                await booking.save();
                res
                .status(200)
                .json({ message: "Booking status updated successfully",data: booking });


              }
              catch(err)
              {
                res.json(err)
              }
            }
            else if (status=== "Completed"){
              try{
                console.log("here")
                console.log(booking.parking)
               const id = booking.parking
                const Parking = await ParkingModel.findById(id);


                booking.status=status;
                console.log("here")

                const value = format(new Date(), "yyyy-MM-dd'T'HH:MM");
                booking.actualOutTime = value

                booking.duration = differenceInMinutes(booking.outTime ,booking.inTime);
                booking.actualDuration = differenceInMinutes(booking.actualOutTime ,booking.actualInTime);

                const unit = booking.actualDuration - booking.duration;
                if(unit>0)
                {booking.exceedPrice = Parking?.exceed_price * (unit/Parking.exceed_price_for)
               
                booking.exceedCGST = Math.ceil(booking.exceedPrice * 0.09);
                booking.exceedSGST = Math.ceil(booking.exceedPrice * 0.09);
                booking.exceedTime = unit}
                else   {booking.exceedPrice =0
               
                booking.exceedCGST =0
                booking.exceedSGST = 0
                booking.exceedTime = 0}
                booking.exceedTotalPrice = booking.exceedCGST + booking.exceedSGST+ booking.exceedPrice
                booking.bookingPrice = booking.totalPrice+ booking.exceedTotalPrice;

                await booking.save()
                res
                .status(200)
                .json({ message: "Booking status updated successfully",data: booking });


              }
              catch(err)
              {
                res.json(err)
              }
            }
   
   
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  