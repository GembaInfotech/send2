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

    // Fetch bookings with pagination
    const bookings = await BookingModel.find(query)
                                      .skip(skip)
                                      .limit(limit)
                                      .exec();

    if (!bookings.length) {
      return res.json({ bookings: [], totalCount: 0, totalPages: 0, currentPage: page });
    }

    // Total count of bookings matching the query
    const totalCount = await BookingModel.countDocuments(query).exec();
    const totalPages = Math.ceil(totalCount / limit);

    // Map over bookings to fetch related vehicle info
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

    console.log(bookingsWithVehicleInfo, totalCount, totalPages, page);
    
    // Send the response with bookings, total count, and pagination metadata
    res.json({
      bookings: bookingsWithVehicleInfo,
      totalCount: totalCount,   // Include total count in the response
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}


module.exports = { getBookingsByQuery };
