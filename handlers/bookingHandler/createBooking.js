const BookingModel = require('../../models/booking.model');
const moment = require('moment');

// exports.createBooking = async (req, res) => {
//   try {
//     const user = req.userId;
//     console.log(req.body)
//     console.log(user);
//     const {
//       parking,
//       inTime,
    
    
//     } = req.body.bookingData;

//     const newBooking = new Booking({
//       user,
//       parking,
    
//       inTime
    
   
//     });

//     // Save the booking
//     const savedBooking = await newBooking.save();

//     // Send response
//     res.status(201).json({ booking: savedBooking });
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.createBooking = async (req, res) => {
    try {
        const {
            // user,
            parking,
            inTime,
            outTime,
            // actualInTime,
            // actualOutTime,
            vehicleNumber,
            price,
            status
        } = req.body;

        // Calculate duration
        const intimeMoment = moment(inTime, 'YYYY-MM-DD HH:mm:ss');
        const outtimeMoment = moment(outTime, 'YYYY-MM-DD HH:mm:ss');
        const duration = moment.duration(outtimeMoment.diff(intimeMoment)).humanize();
        const BookingDate = moment().format('YYYY-MM-DD HH:mm:ss');

        // Calculate GST
        const cgst = price * 0.09;
        const sgst = price * 0.09;
        const bookingDate = moment().format('YYYY-MM-DD HH:mm:ss');

        // Create a new booking instance
        const newBooking = new BookingModel({
            // user,
            parking,
            inTime,
            outTime,
            // actualInTime,
            // actualOutTime,
            duration,
            // actualDuration,
            BookingDate,
            // BookingDate is automatically set to current date
            // exceedTime,
            vehicleNumber,
            price,
            cgst,
            sgst,
            // exceedPrice,
            // exceedCGST,
            // exceedSGST,
            // exceedTotalPrice,
            // totalPrice,
            // bookingPrice,
            // paymentId,
            status
        });

        // Save the new booking to the database
        await newBooking.save();

        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create booking",
        });
    }
}




