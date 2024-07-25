
const BookingModel = require('../../models/booking.model')

exports.getBookingsByQuery = async (req, res, next) => {
    try {
        const { parkingid, status } = req.query;
        console.log(parkingid, status)
        
        const query = {};
        if (parkingid) {
            query.parking = parkingid;
        }
        if (status) {
            query.status = status;
        }

        const bookings = await BookingModel.find(query).sort({inTime:-1});

        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings",
        });
    }
};