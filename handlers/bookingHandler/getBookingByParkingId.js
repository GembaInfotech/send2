exports.getBookingByParkingId = async (req, res) => {
    try {
        let parkingIds = req.query.parking;
        console.log(parkingIds);
        
        let page = parseInt(req.query.page) || 1; 
        console.log(page);
        
        let limit = parseInt(req.query.limit) || 10; 
        console.log(limit);
        

        // console.log(parkingIds);

        const parkingIdsArray = parkingIds.includes(",") ? parkingIds.split(",") : [parkingIds];

        const bookings = await BookingModel.find({ parking: { $in: parkingIdsArray } })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalBookings = await BookingModel.countDocuments({ parking: { $in: parkingIdsArray } });

        console.log(bookings);

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
