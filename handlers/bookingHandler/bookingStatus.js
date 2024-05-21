const BookingModel = require('../../models/booking.model');

exports.bookingStatus = async (req, res) => {
    const { status , tp} = req.body;
    try {
      const { bookingId } = req.params;
      const booking = await BookingModel.findById(bookingId);
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      if (booking.status === status)  return res
          .status(400)
          .json({ error: "Booking status is already completed" });
      booking.status = status;
      booking.totalPrice=tp;
      await booking.save();
      res
        .status(200)
        .json({ message: "Booking status updated successfully",data: booking });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  