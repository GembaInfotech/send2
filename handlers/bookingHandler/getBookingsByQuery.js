
const BookingModel = require('../../models/booking.model')

exports.getBookingsByQuery = async (req, res, next) => {
    try {
        const { parkingid, status } = req.query;

        // Build the query object
        const query = {};
        if (parkingid) {
            query.parking_id = parkingid;
        }
        if (status) {
            query.status = status;
        }

        // Fetch bookings based on query
        const bookings = await BookingModel.find(query);

        res.status(200).json({ bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch bookings",
        });
    }
};