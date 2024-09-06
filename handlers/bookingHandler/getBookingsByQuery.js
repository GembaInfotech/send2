const BookingModel = require('../../models/booking.model');
const User = require('../../models/user.model');

async function getBookingsByQuery(req, res, next) {
  try {
    // Extract and validate query parameters
    const parkingId = req.query.parkingid;
    const status = req.query.status; // Optional status filter
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default to limit 10 if not provided
    const skip = (page - 1) * limit;

    // Check if parkingId is provided
    if (!parkingId) {
      return res.status(400).json({ message: 'Parking ID is required' });
    }

    // Build the query object
    const query = { parking: parkingId };
    if (status) {
      query.status = status;
    }

    // Find all bookings for the specified parking ID with optional status filter and pagination
    const bookings = await BookingModel.find(query)
                                      .skip(skip)
                                      .limit(limit)
                                      .exec();

    if (!bookings.length) {
      return res.json({ bookings: [], totalPages: 0, currentPage: page });
    }

    // Count the total number of bookings for the specified parking ID with optional status filter
    const totalCount = await BookingModel.countDocuments(query).exec();
    const totalPages = Math.ceil(totalCount / limit);

    // Retrieve vehicle details for each booking
    const bookingsWithVehicleInfo = await Promise.all(
      bookings.map(async (booking) => {
        const user = await User.findById(booking.user).exec();

        if (!user) {
          throw new Error('User not found');
        }

        const vehicle = user.vehicle.id(booking.vehicleId);

        if (!vehicle) {
          throw new Error('Vehicle not found');
        }

        return {
          ...booking.toObject(),
          vehicle: {
            name: vehicle.vehicle_name,
            type: vehicle.vehicle_type,
            number: vehicle.vehicle_number,
          },
        };
      })
    );

    // Send the response with bookings, totalPages, and currentPage
    res.json({
      bookings: bookingsWithVehicleInfo,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getBookingsByQuery };
