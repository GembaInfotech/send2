const BookingModel = require('../../models/booking.model')

exports.getBookingByParkingId = async (req, res) => {
    try {
        const parkingId = req.query.parking;
        console.log(parkingId);
        
        const bookings = await BookingModel.find({parking:parkingId});
        console.log(bookings);

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to retrieve upcoming bookings",
        });
    }
};



