const BookingModel = require('../../models/booking.model');

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

exports.createBooking = async (req, res, next) => {
    try {
        const {
            // user,
            parking,
            inTime,
            outTime,
            // actualInTime,
            // actualOutTime,
            // duration,
            // actualDuration,
            // BookingDate,
            // exceedTime,
            vehicleNumber,
            price,
            // cgst,
            // sgst,
            // exceedPrice,
            // exceedCGST,
            // exceedSGST,
            // exceedTotalPrice,
            // totalPrice,
            // bookingPrice,
            // paymentId,
            status
        } = req.body;

        // Create a new booking instance
        const newBooking = new BookingModel({
            // user,
            parking,
            inTime,
            outTime,
            // actualInTime,
            // actualOutTime,
            // duration,
            // actualDuration,
            // BookingDate,
            // exceedTime,
            vehicleNumber,
            price,
            // cgst,
            // sgst,
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
};

