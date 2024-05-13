const Booking = require('../../models/booking.model');

const incomingBookingStatus = async (req, res) => {
  try {
    console.log("testing.....1");
    const { user } = req.userId;

    // Set status as "Incoming" and actualInTime as Date.now()
    const updateData = {
      status: "Incoming",
      actualInTime: Date.now()
    };

    // Find the booking by ID and update it with the provided data
    const updatedBooking = await Booking.findByIdAndUpdate(user, updateData, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = incomingBookingStatus;
