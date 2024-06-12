const moment = require('moment')
const BookingModel = require('../../models/booking.model')

exports.getIncomingBokingIn15Min = async (req, res) => {
    try {
        const { parkingId } = req.params;
        console.log(parkingId);

        // Create the current time in UTC+5:30
        const now = new Date();
        const offset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
        const nowUTC530 = new Date(now.getTime() + offset);

        // Create the time 15 minutes from now in UTC+5:30
        const inFifteenMinutesUTC530 = new Date(nowUTC530.getTime() + 15 * 60 * 1000); // Add 15 minutes in milliseconds

        const nowISOString = nowUTC530.toISOString(); // Full ISO string
        console.log(nowISOString);
        const inFifteenMinutesISOString = inFifteenMinutesUTC530.toISOString(); // Full ISO string

        const query = {
            inTime: {
                $gte: nowISOString,
                $lte: inFifteenMinutesISOString
            },
            parking: parkingId
        };

        const bookings = await BookingModel.find(query);
        console.log(bookings);

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to retrieve upcoming bookings",
        });
    }
};

