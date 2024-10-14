const BookingModel = require('../../models/booking.model');
const User = require('../../models/user.model');

async function getBookingsByQuery(req, res, next) {
  try {
    const parkingId = req.query.parkingid;
    const status = req.query.status;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    if (!parkingId) {
      return res.status(400).json({ message: 'Parking ID is required' });
    }

    const query = { parking: parkingId };
    if (status) {
      query.status = status;
    }

    // Fetch all bookings (without pagination) for total calculations
    const allBookings = await BookingModel.find(query).exec();

    // Initialize total values
    let totalIncome = 0;
    let totalSGST = 0;
    let totalCGST = 0;
    let totalPlatformFee = 0;
    let totalGST = 0; // Total GST for Confirmed, Cancelled, and Parked bookings
    let totalNetIncome = 0;

    // Calculate totals for all bookings
    allBookings.forEach((booking) => {
      if (['Confirmed', 'Cancelled', 'Parked'].includes(booking.status)) {
        // For Confirmed, Cancelled, and Parked statuses: Use totalPrice
        totalIncome += booking.totalPrice;

        // Calculate SGST and CGST for these statuses
        totalSGST += booking.sgst;
        totalCGST += booking.cgst;
        totalGST += booking.sgst + booking.cgst; // Total GST for Confirmed, Cancelled, Parked
      } else if (booking.status === 'Completed') {
        // For Completed status: Use bookingPrice
        totalIncome += booking.bookingPrice;

        // Add SGST and CGST for Completed bookings (including exceeded amounts)
        totalSGST += booking.sgst + booking.exceedSGST;
        totalCGST += booking.cgst + booking.exceedCGST;
        totalGST += booking.sgst + booking.exceedSGST + booking.cgst + booking.exceedCGST;

        // Add platform fee for Completed bookings
        if (booking.total_plateform_amount) {
          const platformAmounts = booking.total_plateform_amount
            .split('.') // Split the string by '.' to get individual amounts
            .map(Number) // Convert each amount to a number
            .filter(num => !isNaN(num)); // Filter out any NaN values

          // Sum up the platform amounts
          totalPlatformFee += platformAmounts.reduce((acc, curr) => acc + curr, 0);
        }
      }
    });

    // Calculate total net income
    totalNetIncome = totalIncome - totalSGST - totalCGST - totalPlatformFee;

    // Round totals to two decimal places
    totalIncome = parseFloat(totalIncome.toFixed(2));
    totalSGST = parseFloat(totalSGST.toFixed(2));
    totalCGST = parseFloat(totalCGST.toFixed(2));
    totalGST = parseFloat(totalGST.toFixed(2)); // Total GST for Confirmed, Cancelled, Parked statuses
    totalPlatformFee = parseFloat(totalPlatformFee.toFixed(2));
    totalNetIncome = parseFloat(totalNetIncome.toFixed(2));

    // Fetch bookings with pagination for the current page
    const paginatedBookings = await BookingModel.find(query)
    .populate("parking", "name code address city state country") // Populate parking with specific fields
    .skip(skip)
    .limit(limit)
    .exec();
  
    if (!paginatedBookings.length) {
      return res.json({ bookings: [], totalCount: 0, totalPages: 0, currentPage: page });
    }

    // Total count of all bookings
    const totalCount = await BookingModel.countDocuments(query).exec();
    const totalPages = Math.ceil(totalCount / limit);

    // Map over bookings to fetch related vehicle info from User model
    const bookingsWithVehicleInfo = await Promise.all(
      paginatedBookings.map(async (booking) => {
        // Fetch the user and vehicle information based on vehicleId
        const user = await User.findById(booking.user).exec();
        if (!user) throw new Error('User not found');

        const vehicle = user.vehicle.id(booking.vehicleId);
        if (!vehicle) throw new Error('Vehicle not found');

        return {
          ...booking.toObject(),
          vehicle: {
            name: vehicle.vehicle_name,
            type: vehicle.vehicle_type,
            number: vehicle.vehicle_number,
          },
          parkingName: booking.parking.parkingName // Add parkingName from the populated Parking model
        };
      })
    );

    // Send the response with bookings and calculated totals for all bookings
    res.json({
      bookings: bookingsWithVehicleInfo,
      totalCount,
      totalPages,
      currentPage: page,
      totalIncome,
      totalSGST,
      totalCGST,
      totalGST,          // Total GST for Confirmed, Cancelled, Parked statuses
      totalPlatformFee,
      totalNetIncome,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}




module.exports = { getBookingsByQuery };
