const BookingModel = require('../../models/booking.model')

exports.getBookingByParkingId = async (req, res) => {
    try {
        let parkingIds = req.query.parking;
        console.log(parkingIds);
        
        let page = parseInt(req.query.page) || 1; 
        console.log(page);
        
        let limit = parseInt(req.query.limit) || 10; 
        console.log(limit);

        const parkingIdsArray = parkingIds.includes(",") ? parkingIds.split(",") : [parkingIds];

        // Find bookings and populate user and vehicle details
        const bookings = await BookingModel.find({ parking: { $in: parkingIdsArray } })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: 'user', // Populate the user information
                select: 'vehicle', // Only fetch the vehicle details from the user
                populate: {
                    path: 'vehicle', // Fetch the vehicle details if it's a subdocument
                    match: { _id: { $eq: '$vehicleId' } }, // Match the vehicleId from the booking
                    select: 'vehicle_name vehicle_number vehicle_type', // Only select relevant fields
                }
            });

        const totalBookings = await BookingModel.countDocuments({ parking: { $in: parkingIdsArray } });

        res.status(200).json({
            bookings,
            currentPage: page,
            totalPages: Math.ceil(totalBookings / limit),
            totalBookings,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to retrieve bookings",
        });
    }
};

