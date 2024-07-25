const BookingModel = require('../../models/booking.model')

exports.getBookingByParkingId = async (req, res) => {
    try {
        let parkingIds = req.query.parking; 
        console.log(parkingIds);

        const parkingIdsArray = parkingIds.includes(",") ? parkingIds.split(",") : [parkingIds];

        const bookings = await BookingModel.find({ parking: { $in: parkingIdsArray } });
        console.log(bookings);

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to retrieve bookings",
        });
    }
};
