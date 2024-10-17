const Booking = require('../../models/booking.model');

exports.viewBookingListPayout = async (req, res) => {
  try {
    const { vendorId, parkingId, startDate, endDate } = req.query;

    console.log(vendorId, startDate, endDate);
    const filter = {};

    // Vendor filter
    if (vendorId) {
      filter.vendor = vendorId;
    }

    // Parking filter
    if (parkingId) {
      filter.parking = parkingId;
    }


    // Filter by vendor name if provided
    // if (vendorName) {
    //   filter['vendor.firstName'] = { $regex: vendorName, $options: 'i' }; // case-insensitive
    // }

    // // Filter by parking name if provided
    // if (parkingName) {
    //   filter['parking.name'] = { $regex: parkingName, $options: 'i' }; // case-insensitive
    // }

    // Filter by date range if provided
    // if (startDate && endDate) {
    //   filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    // } else if (startDate) {
    //   filter.createdAt = { $gte: new Date(startDate) };
    // } else if (endDate) {
    //   filter.createdAt = { $lte: new Date(endDate) };
    // }

    if (startDate && endDate) {
      // Convert startDate and endDate to the full day range
      filter.actualOutTime = {
        $gte: `${startDate}T00:00:00`,  // Start of startDate (YYYY-MM-DDT00:00:00)
        $lte: `${endDate}T23:59:59`     // End of endDate (YYYY-MM-DDT23:59:59)
      };
    } else if (startDate) {
      // If only startDate is provided
      filter.actualOutTime = { $gte: `${startDate}T00:00:00` };
    } else if (endDate) {
      // If only endDate is provided
      filter.actualOutTime = { $lte: `${endDate}T23:59:59` };
    }

    // Only include completed bookings
    filter.status = 'Completed';

    console.log("filter", filter);
    

    // Query the database with the applied filters
    const bookings = await Booking.find(filter)
      .populate('parking', 'code name')
      .populate('vendor', 'code firstName lastName email');

      console.log("booking", bookings);
      
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
