const Booking = require('../../models/booking.model');

exports.createBooking = async (req, res) => {
  try {
    const user = req.userId;
    console.log(req.body)
    console.log(user);
    const {
      
      parking,
      inTime,
     
    
    
    } = req.body.bookingData;

    const newBooking = new Booking({
      user,
      parking,
    
      inTime
    
   
    });

    // Save the booking
    const savedBooking = await newBooking.save();

    // Send response
    res.status(201).json({ booking: savedBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
