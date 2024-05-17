exports.getIncomingBokingIn15Min = async (req, res) =>{
    try {
        const now = moment();
        const inFifteenMinutes = moment().add(15, 'minutes');

        const bookings = await BookingModel.find({
            inTime: {
                $gte: now.toDate(),
                $lte: inFifteenMinutes.toDate()
            }
        })
        .sort({ inTime: 1 }) // Sort by inTime ascending
        .limit(5); // Limit to 5 results

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to retrieve upcoming bookings",
        });
    }
};


// exports.getRecentIncomingBooking = async (req, res) => {
//     try {
//         const bookings = await BookingModel.find({
//             inTime: { $gte: new Date() } // Find bookings where inTime is in the future
//         })
//         .sort({ inTime: 1 }) // Sort by inTime ascending
//         .limit(5); // Limit to 5 results

//         res.status(200).json(bookings);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "Failed to retrieve recent bookings",
//         });
//     }
// };