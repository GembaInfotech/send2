const BookingModel = require('../../models/booking.model')

// exports.getBookingByParkingId = async (req, res) => {
//     try {
//         const parkingId = req.query.parking;
//         console.log(parkingId);
        
//         const bookings = await BookingModel.find({parking:parkingId});
//         console.log(bookings);

//         res.status(200).json(bookings);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "Failed to retrieve upcoming bookings",
//         });
//     }
// };



exports.getBookingByParkingId = async (req, res) => {
    try {
        let parkingIds = req.query.parking; // this should be a comma-separated string of parking IDs
        console.log(parkingIds);

        // Check if parkingIds is a single string, if so, split it into an array
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
