const Booking = require('../../models/booking.model');

exports.viewBookingListPayout = async (req, res) => {
  try {
    const { vendorId, parkingId, startDate, endDate } = req.query;
    console.log(vendorId, startDate, endDate);
    const filter = {};
    if (vendorId) {
      filter.vendor = vendorId;
    }
    if (parkingId) {
      filter.parking = parkingId;
    }
    if (startDate && endDate) {
      filter.actualOutTime = {
        $gte: `${startDate}T00:00:00`, 
        $lte: `${endDate}T23:59:59` 
      };
    } else if (startDate) {
      filter.actualOutTime = { $gte: `${startDate}T00:00:00` };
    } else if (endDate) {
      filter.actualOutTime = { $lte: `${endDate}T23:59:59` };
    }
    filter.status = 'Completed';
    filter.is_invoice_generated = false

    const bookings = await Booking.find(filter)
      .populate('parking', 'code name')
      .populate('vendor', 'code firstName lastName email');

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking data',
      error: error.message
    });
  }
};
